// Desktop widgets + system tray for Todo.Txt.
//
// This module owns everything desktop-specific that the webview cannot do
// itself: the system-tray icon and its menu, the lifecycle of the small
// floating widget windows, and the bridge that forwards the app's parsed
// todo/habit state (the same projection the Android home-screen widgets
// render from) into those windows so they stay live.
//
// Design notes:
// - Widget windows are Tauri webview windows, not Electron renderers: one
//   shared webkit process, frameless/transparent/always-on-top, so each
//   widget costs almost nothing beyond the HTML it paints.
// - The data pipeline is deliberately read-only here: the frontend remains
//   the single source of truth (Firestore + sync engine). Widgets only
//   *display* projections and ask the frontend to act via deep-link style
//   commands, mirroring how the Android widget providers work.
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{
	command, menu::Menu, menu::MenuItem, tray::TrayIconBuilder, webview::PageLoadPayload, AppHandle,
	Emitter, Manager, Runtime, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_store::StoreExt;

/// Load the tray icon from the bundled PNG bytes. The tray `icon` builder
/// accepts an `Image::new(rgba, w, h)`; we decode the 32x32 PNG with the
/// `image` crate when that feature is available, else use `from_path`.
fn tray_icon() -> tauri::Result<tauri::image::Image<'static>> {
	let bytes = include_bytes!("../icons/32x32.png");
	let img = image::load_from_memory(bytes).map_err(|e| tauri::Error::AssetNotFound(e.to_string()))?;
	let rgba = img.to_rgba8();
	let (w, h) = (rgba.width(), rgba.height());
	Ok(tauri::image::Image::new_owned(rgba.into_raw(), w, h))
}

// ---------------------------------------------------------------
// Payloads — must stay in sync with src/lib/widgetDataBridge.ts
// ---------------------------------------------------------------
#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WidgetTaskProjection {
	pub id: i64,
	pub text: String,
	pub done: bool,
	pub due: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WidgetMomentum {
	pub best_streak: i64,
	pub best_habit_name: String,
	pub avg_rate28: i64,
	pub habits_done_today: i64,
	pub habits_total: i64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WidgetPayload {
	pub date: String,
	pub tasks: Vec<WidgetTaskProjection>,
	#[serde(default)]
	pub momentum: Option<WidgetMomentum>,
}

// ---------------------------------------------------------------
// Stored state shared between the tray menu and widget windows
// ---------------------------------------------------------------
pub struct WidgetsState {
	pub tray_id: Mutex<Option<String>>,
	pub latest: Mutex<Option<WidgetPayload>>,
}

/// Persisted toggle flags per widget. Stored in the Tauri store so user
/// choices survive restarts without any schema work here.
const STORE_FILE: &str = "desktop-widgets.json";
const KEY_VISIBILITY: &str = "widget_visibility";

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WidgetVisibility {
	pub todo: bool,
	pub overview: bool,
	pub habits: bool,
}

// ---------------------------------------------------------------
// Commands exposed to the webview (renderer -> main)
// ---------------------------------------------------------------

/// The frontend pushes its projected state into the desktop widgets.
/// Mirrors `plugin:widget-data|push` used by the Android plugin pipeline
/// so both surfaces always render the same numbers.
#[command]
pub async fn push_desktop_widget_data<R: Runtime>(
	app: AppHandle<R>,
	payload: WidgetPayload,
) -> Result<(), String> {
	let state = app
		.try_state::<WidgetsState>()
		.ok_or("desktop widgets not initialized")?;
	{
		let mut latest = state.latest.lock().map_err(|e| format!("{e}"))?;
		*latest = Some(payload.clone());
	}
	// Relay the projection to every open widget window.
	for label in ["widget-todo", "widget-overview", "widget-habits"] {
		if let Some(window) = app.get_webview_window(label) {
			let _ = window.emit("desktop-widget-data", &payload);
		}
	}
	Ok(())
}

/// Toggle the visibility of a widget window.
#[command]
pub async fn toggle_desktop_widget<R: Runtime>(
	app: AppHandle<R>,
	widget: String,
	visible: bool,
) -> Result<(), String> {
	set_widget_visibility(&app, &widget, visible)?;
	// Let the dashboard re-read the visibility map afterwards.
	if let Some(window) = app.get_webview_window("main") {
		let _ = window.emit("desktop-widget-visibility-changed", widget.as_str());
	}
	Ok(())
}

/// Open the main window and focus it (used by the tray "Show app" item).
#[command]
pub async fn show_main_window<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
	if let Some(window) = app.get_webview_window("main") {
		let _ = window.show();
		let _ = window.set_focus();
	}
	Ok(())
}

// ---------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------
fn set_widget_visibility<R: Runtime>(
	app: &AppHandle<R>,
	widget: &str,
	visible: bool,
) -> Result<(), String> {
	let label = match widget {
		"todo" => "widget-todo",
		"overview" => "widget-overview",
		"habits" => "widget-habits",
		other => return Err(format!("unknown widget: {other}")),
	};
	let window = match app.get_webview_window(label) {
		Some(w) => w,
		None => create_widget_window(app, widget, label).map_err(|e| format!("{e}"))?,
	};
	if visible {
		let _ = window.show();
		let _ = window.set_focus();
	} else {
		let _ = window.hide();
	}
	persist_visibility(app, widget, visible)?;
	Ok(())
}

fn persist_visibility<R: Runtime>(
	app: &AppHandle<R>,
	widget: &str,
	visible: bool,
) -> Result<(), String> {
	let store = app
		.store(STORE_FILE)
		.map_err(|_| "store unavailable")?;
	let mut visibility: WidgetVisibility = store
		.get(KEY_VISIBILITY)
		.and_then(|v| serde_json::from_value(v).ok())
		.unwrap_or_default();
	match widget {
		"todo" => visibility.todo = visible,
		"overview" => visibility.overview = visible,
		"habits" => visibility.habits = visible,
		_ => {}
	}
	store.set(KEY_VISIBILITY, serde_json::to_value(&visibility).unwrap());
	Ok(())
}

fn create_widget_window<R: Runtime>(
	app: &AppHandle<R>,
	widget: &str,
	label: &str,
) -> tauri::Result<tauri::webview::WebviewWindow<R>> {
	// In dev, Tauri serves the frontend from the Vite dev server and the
	// asset scope rejects arbitrary external origins, so route through the
	// app's own dev base URL (the dev server proxies it). In production the
	// URL resolves against the bundled frontend via WebviewUrl::App, which
	// keeps the CSP asset protocol happy on every platform.
	let is_dev = cfg!(dev);
	let url = if is_dev {
		WebviewUrl::External(
			format!("http://localhost:5173/widget/{widget}")
				.parse()
				.unwrap(),
		)
	} else {
		WebviewUrl::App(format!("widget/{widget}").parse().unwrap())
	};
	let window = WebviewWindowBuilder::new(app, label, url)
		.title("Todo.Txt Widget")
		.inner_size(320.0, 260.0)
		.resizable(false)
		.transparent(true)
		.decorations(false)
		.always_on_top(true)
		.visible(false)
		.shadow(false)
		.skip_taskbar(true)
		.build()?;
	Ok(window)
}

/// Wire the tray icon: status menu + dashboard popup.
fn build_tray<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<String> {
	let show_main = MenuItem::with_id(app, "show-app", "Show Todo.Txt", true, None::<&str>)?;
	let toggle_todo = MenuItem::with_id(app, "toggle-todo", "Todo widget", true, None::<&str>)?;
	let toggle_overview =
		MenuItem::with_id(app, "toggle-overview", "Overview widget", true, None::<&str>)?;
	let toggle_habits =
		MenuItem::with_id(app, "toggle-habits", "Habits widget", true, None::<&str>)?;
	let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

	let menu = Menu::with_items(app, &[&show_main, &toggle_todo, &toggle_overview, &toggle_habits, &quit])?;

	let tray = TrayIconBuilder::with_id("tray")
		.icon(tray_icon()?)
		.tooltip("Todo.Txt")
		.menu(&menu)
		.show_menu_on_left_click(true)
		.on_menu_event(move |app, event| match event.id.as_ref() {
			"show-app" => {
				let _ = show_main_window(app.clone());
			}
			"toggle-todo" => {
				let _ = toggle_desktop_widget(app.clone(), "todo".into(), true);
			}
			"toggle-overview" => {
				let _ = toggle_desktop_widget(app.clone(), "overview".into(), true);
			}
			"toggle-habits" => {
				let _ = toggle_desktop_widget(app.clone(), "habits".into(), true);
			}
			"quit" => {
				app.exit(0);
			}
			_ => {}
		})
		.build(app)?;

	Ok(tray.id().as_ref().to_string())
}

/// Restore previously visible widgets after a restart, then push the
/// latest projection (if any) so they never flash stale content.
fn restore_widgets<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
	let visibility: WidgetVisibility = app
		.store(STORE_FILE)
		.map(|store| store.get(KEY_VISIBILITY))
		.unwrap_or_default()
		.and_then(|v| serde_json::from_value(v).ok())
		.unwrap_or_default();
	let pairs: &[(&str, bool)] = &[
		("todo", visibility.todo),
		("overview", visibility.overview),
		("habits", visibility.habits),
	];
	for &(widget, visible) in pairs {
		if visible {
			set_widget_visibility(app, widget, true)?;
		}
	}
	// Re-emit the cached projection to any restored windows.
	if let Some(state) = app.try_state::<WidgetsState>() {
		if let Ok(guard) = state.latest.lock() {
			if let Some(payload) = guard.as_ref() {
				for label in ["widget-todo", "widget-overview", "widget-habits"] {
					if let Some(window) = app.get_webview_window(label) {
						let _ = window.emit("desktop-widget-data", payload);
					}
				}
			}
		}
	}
	Ok(())
}

// ---------------------------------------------------------------
// Plugin wiring
// ---------------------------------------------------------------
/**
 * One-time setup: state, tray icon, and restoring previously visible
 * widgets. Called from `lib.rs` during `Builder::setup`, which is also
 * where the command handler list is registered — Tauri only generates
 * permission scopes for commands passed directly to the builder, so the
 * three widget commands are **not** wrapped in a `TauriPlugin`.
 */
pub fn setup<R: Runtime>(
	app: &mut tauri::App<R>,
) -> std::result::Result<(), Box<dyn std::error::Error>> {
	let state = WidgetsState {
		tray_id: Mutex::new(None),
		latest: Mutex::new(None),
	};

	let tray_id = build_tray(&app.handle()).map_err(|e| {
		log::error!("failed to build tray: {e}");
		Box::<dyn std::error::Error>::from(e.to_string())
			as Box<dyn std::error::Error>
	});
	if let Ok(id) = tray_id {
		if let Ok(mut guard) = state.tray_id.lock() {
			*guard = Some(id);
		}
	}

	app.manage(state);

	restore_widgets(app.handle()).unwrap_or_else(|e| {
		log::warn!("could not restore desktop widgets: {e}");
	});
	Ok(())
}

/** Handler invoked when a widget webview finishes loading: push the
 * cached projection into it so it renders real data immediately. */
pub fn on_page_load<R: Runtime>(
	window: &tauri::Webview<R>,
	payload: &PageLoadPayload,
) {
	if payload.event() != tauri::webview::PageLoadEvent::Finished {
		return;
	}
	// The page-load hook gives us the raw `Webview`; look the concrete
	// window up by label so we can emit the cached projection into it.
	let Some(webview_window) =
		window.app_handle().get_webview_window(window.label())
	else {
		return;
	};
	if !webview_window.label().starts_with("widget-") {
		return;
	}
	if let Some(state) = webview_window.app_handle().try_state::<WidgetsState>() {
		if let Ok(guard) = state.latest.lock() {
			if let Some(payload) = guard.as_ref() {
				let _ = webview_window.emit("desktop-widget-data", payload);
			}
		}
	}
}
