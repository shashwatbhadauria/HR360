mod monitor;
use std::sync::Mutex;
use tauri::State;
use std::fs;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct SupabaseConfig {
    url: String,
    key: String,
}

#[derive(Serialize, Deserialize, Default)]
struct AppConfig {
    employee_id: String,
}

// Global state to prevent starting multiple times
struct AppState {
    monitoring_started: Mutex<bool>,
}

#[tauri::command]
fn get_supabase_config() -> SupabaseConfig {
    SupabaseConfig {
        url: "https://qewwumxaxznuxlkwdvpy.supabase.co".to_string(),
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c".to_string(),
    }
}

#[tauri::command]
fn start_monitoring_with_credentials(employee_id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut started = state.monitoring_started.lock().unwrap();
    if *started {
        return Ok(()); // Already started
    }
    
    // Save to local config.json for persistence
    let config = AppConfig { employee_id: employee_id.clone() };
    if let Ok(json) = serde_json::to_string(&config) {
        let _ = fs::write("config.json", json);
    }
    
    *started = true;
    monitor::start_monitoring(employee_id);
    Ok(())
}

#[tauri::command]
fn get_saved_employee_id() -> String {
    if let Ok(content) = fs::read_to_string("config.json") {
        if let Ok(config) = serde_json::from_str::<AppConfig>(&content) {
            return config.employee_id;
        }
    }
    String::new()
}

#[tauri::command]
fn hide_window(window: tauri::Window) {
    let _ = window.hide();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState { monitoring_started: Mutex::new(false) })
        .invoke_handler(tauri::generate_handler![
            get_supabase_config,
            start_monitoring_with_credentials,
            get_saved_employee_id,
            hide_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
