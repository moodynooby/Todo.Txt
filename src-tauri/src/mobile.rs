// Mobile-only command forwarding for the Android plugins.
//
// On mobile the webview cannot rely on the OS notification scheduler being
// exact, so the Android plugin (`net.todotxt.app.plugins.exactalarms`) owns
// alarm scheduling natively. This module forwards the scheduling commands
// from JS to the Kotlin plugin. On other mobile targets (iOS) the commands
// are no-ops that fail gracefully; reminder scheduling falls back to the
// notification plugin on those platforms.
//
// The widget-data mirror works the same way: the `widget-data` plugin
// forwards pushes to the Kotlin `widgetdata` plugin that writes the JSON
// store the home-screen widgets render from.

use serde::{Deserialize, Serialize};
use tauri::{
    command,
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime,
};

// ---------------------------------------------------------------
// Payloads — mirrors the Kotlin @InvokeArg classes and the JS
// payloads in src/lib/nativeReminders.ts
// ---------------------------------------------------------------

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SchedulePayload {
    pub id: String,
    pub epoch_ms: u64,
    pub title: String,
    pub body: String,
    #[serde(default)]
    pub repeat_daily: bool,
    pub repeat_interval_ms: Option<u64>,
    #[serde(default = "default_channel")]
    pub channel_id: String,
}

fn default_channel() -> String {
    "habits".to_string()
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CancelPayload {
    pub id: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SyncPayload {
    pub reminders: Vec<SchedulePayload>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CanScheduleResult {
    pub allowed: bool,
    pub requested: bool,
    pub requires_runtime_grant: bool,
    pub open_settings_intent: bool,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WidgetPushPayload {
    pub date: String,
    pub tasks: Vec<serde_json::Value>,
    pub habits: Vec<serde_json::Value>,
}

// ---------------------------------------------------------------
// Native handles + extension trait (mirrors `tauri-plugin-notification`)
// ---------------------------------------------------------------

#[cfg(target_os = "android")]
const EXACT_ALARMS_PLUGIN_ID: &str = "net.todotxt.app.plugins.exactalarms";
#[cfg(target_os = "android")]
const WIDGET_DATA_PLUGIN_ID: &str = "net.todotxt.app.plugins.widgetdata";

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_exact_alarms);
#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_widget_data);

/// Handle for the exact-alarm Kotlin plugin.
pub struct ExactAlarms<R: Runtime>(tauri::plugin::PluginHandle<R>);

/// Handle for the widget-data Kotlin plugin.
pub struct WidgetData<R: Runtime>(tauri::plugin::PluginHandle<R>);

pub trait ExactAlarmsExt<R: Runtime> {
    fn exact_alarms(&self) -> &ExactAlarms<R>;
}

pub trait WidgetDataExt<R: Runtime> {
    fn widget_data(&self) -> &WidgetData<R>;
}

impl<R: Runtime, T: Manager<R>> ExactAlarmsExt<R> for T {
    fn exact_alarms(&self) -> &ExactAlarms<R> {
        self.state::<ExactAlarms<R>>().inner()
    }
}

impl<R: Runtime, T: Manager<R>> WidgetDataExt<R> for T {
    fn widget_data(&self) -> &WidgetData<R> {
        self.state::<WidgetData<R>>().inner()
    }
}

// ---------------------------------------------------------------
// Commands — forwarded to the Android Kotlin plugin
// ---------------------------------------------------------------

#[command]
async fn schedule<R: Runtime>(
    app: AppHandle<R>,
    payload: SchedulePayload,
) -> Result<(), String> {
    app.exact_alarms()
        .0
        .run_mobile_plugin("schedule", payload)
        .map_err(|e| format!("schedule failed: {e}"))
}

#[command]
async fn cancel<R: Runtime>(app: AppHandle<R>, payload: CancelPayload) -> Result<(), String> {
    app.exact_alarms()
        .0
        .run_mobile_plugin("cancel", payload)
        .map_err(|e| format!("cancel failed: {e}"))
}

#[command]
async fn can_schedule<R: Runtime>(app: AppHandle<R>) -> Result<CanScheduleResult, String> {
    app.exact_alarms()
        .0
        .run_mobile_plugin("canSchedule", ())
        .map_err(|e| format!("canSchedule failed: {e}"))
}

#[command]
async fn open_exact_alarm_settings<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    app.exact_alarms()
        .0
        .run_mobile_plugin("openExactAlarmSettings", ())
        .map_err(|e| format!("openExactAlarmSettings failed: {e}"))
}

#[command]
async fn sync<R: Runtime>(app: AppHandle<R>, payload: SyncPayload) -> Result<(), String> {
    app.exact_alarms()
        .0
        .run_mobile_plugin("sync", payload)
        .map_err(|e| format!("sync failed: {e}"))
}

#[command]
async fn push_widget_data<R: Runtime>(
    app: AppHandle<R>,
    payload: WidgetPushPayload,
) -> Result<(), String> {
    app.widget_data()
        .0
        .run_mobile_plugin("push", payload)
        .map_err(|e| format!("push widget data failed: {e}"))
}

// ---------------------------------------------------------------
// Plugin registration — only compiled for mobile targets
// ---------------------------------------------------------------

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("exact-alarms")
        .invoke_handler(tauri::generate_handler![
            schedule,
            cancel,
            can_schedule,
            open_exact_alarm_settings,
            sync,
        ])
        .setup(|app, api| {
            #[cfg(target_os = "android")]
            let handle = api
                .register_android_plugin(EXACT_ALARMS_PLUGIN_ID, "ExactAlarmsPlugin")
                .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
            #[cfg(target_os = "ios")]
            let handle = api
                .register_ios_plugin(init_plugin_exact_alarms)
                .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
            app.manage(ExactAlarms(handle));
            Ok(())
        })
        .build()
}

pub fn init_widget_data<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("widget-data")
        .invoke_handler(tauri::generate_handler![push_widget_data])
        .setup(|app, api| {
            #[cfg(target_os = "android")]
            let handle = api
                .register_android_plugin(WIDGET_DATA_PLUGIN_ID, "WidgetDataPlugin")
                .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
            #[cfg(target_os = "ios")]
            let handle = api
                .register_ios_plugin(init_plugin_widget_data)
                .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
            app.manage(WidgetData(handle));
            Ok(())
        })
        .build()
}
