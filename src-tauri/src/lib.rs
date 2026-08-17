#[cfg(mobile)]
pub mod mobile;

#[cfg(not(mobile))]
pub mod desktop_widgets;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Build the Tauri application. The chain is broken into statements so that
    // the desktop-only plugins (whose crates are not linked on mobile targets,
    // see the target gate in Cargo.toml) can be cfg-gated per statement.
    let mut builder = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_deep_link::init());

    // The three desktop-widget commands are registered directly on the
    // builder (not inside a `TauriPlugin`): Tauri only generates capability
    // permission scopes for commands passed to `invoke_handler` at this
    // level, so a same-crate plugin would leave them unpermitted.
    #[cfg(not(mobile))]
    {
        builder = builder.invoke_handler(tauri::generate_handler![
            self::desktop_widgets::push_desktop_widget_data,
            self::desktop_widgets::toggle_desktop_widget,
            self::desktop_widgets::show_main_window,
        ]);
    }

    #[cfg(mobile)]
    {
        builder = builder
            .plugin(self::mobile::init())
            .plugin(self::mobile::init_widget_data());
    }

    #[cfg(not(mobile))]
    {
        builder = builder
            .plugin(tauri_plugin_global_shortcut::Builder::new().build())
            .plugin(tauri_plugin_window_state::Builder::new().build())
            .setup(self::desktop_widgets::setup)
            .on_page_load(self::desktop_widgets::on_page_load);
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
