use serde::Serialize;
use std::collections::HashMap;
use std::ffi::OsString;
use std::os::windows::ffi::OsStringExt;
use std::time::Duration;
use tokio::time;

use windows::Win32::Foundation::MAX_PATH;
use windows::Win32::System::ProcessStatus::GetProcessImageFileNameW;
use windows::Win32::System::Threading::{OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION};
use windows::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};

#[derive(Default, Debug, Serialize)]
struct AppUsage {
    duration_seconds: u32,
    window_titles: Vec<String>,
}

#[derive(Serialize)]
struct RawLogPayload<'a> {
    #[serde(rename = "p_employee_id")]
    employee_id: &'a str,
    #[serde(rename = "p_process_name")]
    process_name: &'a str,
    #[serde(rename = "p_window_title")]
    window_title: &'a str,
    #[serde(rename = "p_duration_seconds")]
    duration_seconds: u32,
}

fn get_active_window() -> Option<(String, String)> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd.0 == std::ptr::null_mut() {
            return None;
        }

        let mut title_buf = [0u16; 512];
        let len = GetWindowTextW(hwnd, &mut title_buf);
        let title = OsString::from_wide(&title_buf[..len as usize])
            .to_string_lossy()
            .into_owned();

        let mut pid = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));
        if pid == 0 {
            return None;
        }

        let process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid).ok()?;

        let mut path_buf = [0u16; MAX_PATH as usize];
        let path_len = GetProcessImageFileNameW(process, &mut path_buf);
        if path_len == 0 {
            let _ = windows::Win32::Foundation::CloseHandle(process);
            return None;
        }

        let full_path = OsString::from_wide(&path_buf[..path_len as usize])
            .to_string_lossy()
            .into_owned();

        let process_name = std::path::Path::new(&full_path)
            .file_name()
            .map(|s| s.to_string_lossy().into_owned())
            .unwrap_or_default();

        let _ = windows::Win32::Foundation::CloseHandle(process);

        Some((process_name, title))
    }
}

pub fn start_monitoring(employee_id: String) {
    tauri::async_runtime::spawn(async move {
        let supabase_url = "https://qewwumxaxznuxlkwdvpy.supabase.co".to_string();
        let supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFld3d1bXhheHpudXhsa3dkdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyMjQsImV4cCI6MjEwMDE5OTIyNH0.SsmW47S35D_bl4l2NqdtO7taboHWdwMqOrJhdkCdQ8c".to_string();

        if supabase_url.is_empty() || supabase_key.is_empty() || employee_id.is_empty() {
            println!("Missing required config. Monitoring disabled.");
            return;
        }

        let client = reqwest::Client::new();
        let mut interval = time::interval(Duration::from_secs(5));
        let mut usage_map: HashMap<String, AppUsage> = HashMap::new();
        let mut ticks = 0;

        loop {
            interval.tick().await;

            if let Some((process, title)) = get_active_window() {
                let entry = usage_map.entry(process).or_default();
                entry.duration_seconds += 5;
                if !entry.window_titles.contains(&title) {
                    entry.window_titles.push(title);
                }
            }

            ticks += 1;
            // Every 60 seconds (12 ticks of 5s)
            if ticks >= 12 {
                if !usage_map.is_empty() {
                    println!("Flushing {} apps to Supabase...", usage_map.len());
                    
                    let mut payloads = Vec::new();
                    for (app, usage) in &usage_map {
                        payloads.push(RawLogPayload {
                            employee_id: &employee_id,
                            process_name: app,
                            window_title: usage.window_titles.first().map(|s| s.as_str()).unwrap_or(""),
                            duration_seconds: usage.duration_seconds,
                        });
                    }

                    // Send to Supabase RPC
                    for payload in &payloads {
                        let url = format!("{}/rest/v1/rpc/log_screentime", supabase_url);
                        let res = client.post(&url)
                            .header("apikey", &supabase_key)
                            .header("Authorization", format!("Bearer {}", supabase_key))
                            .header("Content-Type", "application/json")
                            .json(payload)
                            .send()
                            .await;

                        match res {
                            Ok(response) => {
                                if !response.status().is_success() {
                                    println!("Supabase Error for {}: {:?}", payload.process_name, response.text().await.unwrap_or_default());
                                }
                            }
                            Err(e) => {
                                println!("Network error for {}: {:?}", payload.process_name, e);
                            }
                        }
                    }
                    println!("Successfully synced batch to Supabase.");

                    // Note: A database trigger on Supabase should ideally handle 
                    // updating the screentime_daily_summary, or we can add it here.
                    // For simplicity, we just log raw metrics here.
                }

                usage_map.clear();
                ticks = 0;
            }
        }
    });
}
