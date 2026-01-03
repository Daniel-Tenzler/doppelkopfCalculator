use tauri::{Manager, AppHandle};
use muda::{Menu, MenuItem, PredefinedMenuItem, Submenu};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            
            // Set up app data directory
            let app_data_dir = app.path().app_data_dir().unwrap_or_else(|_| {
                std::env::current_dir().unwrap().join("data")
            });
            
            // Ensure the data directory exists
            if !app_data_dir.exists() {
                std::fs::create_dir_all(&app_data_dir).ok();
            }
            
            log::info!("App data directory: {:?}", app_data_dir);
            
            // Try to create a simple menu using the available APIs
            setup_menu(app.handle())?;
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_data_dir,
            ensure_app_data_dir,
            read_data_file,
            write_data_file,
            delete_data_file,
            list_storage_files,
            get_platform_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_menu(_app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Create menu using muda with a simpler approach for now
    let menu = Menu::new();
    
    // Create simple File submenu
    let file_submenu = Submenu::with_items("File", true, &[
        &MenuItem::new("New Game", true, None),
        &MenuItem::new("Open", true, None), 
        &MenuItem::new("Save", true, None),
        &PredefinedMenuItem::separator(),
        &MenuItem::new("Quit", true, None),
    ])?;
    
    // Create simple Edit submenu
    let edit_submenu = Submenu::with_items("Edit", true, &[
        &MenuItem::new("Undo", true, None),
        &MenuItem::new("Redo", true, None),
        &PredefinedMenuItem::separator(),
        &MenuItem::new("Cut", true, None),
        &MenuItem::new("Copy", true, None),
        &MenuItem::new("Paste", true, None),
        &MenuItem::new("Select All", true, None),
    ])?;
    
    // Create simple Help submenu
    let help_submenu = Submenu::with_items("Help", true, &[
        &PredefinedMenuItem::about(None, None),
    ])?;
    
    // Append all submenus to main menu
    menu.append(&file_submenu)?;
    menu.append(&edit_submenu)?;
    menu.append(&help_submenu)?;
    
    log::info!("Menu setup completed successfully (menu items created but not initialized)");
    Ok(())
}

/// Validates a filename to prevent path traversal attacks
/// Only allows alphanumeric characters, hyphens, underscores, and dots
/// Must end with .json and optionally start with "doppelkopf-"
fn validate_filename(filename: &str) -> Result<(), String> {
    // Check for empty filename
    if filename.is_empty() {
        return Err("Filename cannot be empty".to_string());
    }
    
    // Check length (prevent overly long filenames)
    if filename.len() > 255 {
        return Err("Filename too long (max 255 characters)".to_string());
    }
    
    // Check for dangerous characters that could lead to path traversal
    if filename.contains("..") || filename.contains('/') || filename.contains('\\') {
        return Err("Filename contains invalid characters".to_string());
    }
    
    // Check for null bytes
    if filename.contains('\0') {
        return Err("Filename contains null bytes".to_string());
    }
    
    // Only allow alphanumeric characters, hyphens, underscores, and dots
    if !filename.chars().all(|c| c.is_alphanumeric() || c == '-' || c == '_' || c == '.') {
        return Err("Filename contains invalid characters. Only letters, numbers, hyphens, underscores, and dots are allowed".to_string());
    }
    
    // Must be a JSON file
    if !filename.ends_with(".json") {
        return Err("Filename must end with .json".to_string());
    }
    
    // Optionally, require files to start with "doppelkopf-" for consistency
    if !filename.starts_with("doppelkopf-") {
        return Err("Filename must start with 'doppelkopf-'".to_string());
    }
    
    Ok(())
}

#[tauri::command]
async fn get_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    Ok(app_data_dir.to_string_lossy().to_string())
}

#[tauri::command]
async fn ensure_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    if !app_data_dir.exists() {
        std::fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    }
    
    Ok(app_data_dir.to_string_lossy().to_string())
}

#[tauri::command]
async fn read_data_file(
    app_handle: tauri::AppHandle,
    filename: String,
) -> Result<String, String> {
    // Validate filename to prevent path traversal attacks
    validate_filename(&filename)?;
    
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let file_path = app_data_dir.join(filename);
    
    // Additional safety check: ensure the file is still within the app data directory
    if !file_path.starts_with(&app_data_dir) {
        return Err("Invalid file path: path traversal detected".to_string());
    }
    
    if !file_path.exists() {
        return Err(format!("File does not exist: {:?}", file_path));
    }
    
    std::fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
async fn write_data_file(
    app_handle: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<(), String> {
    // Validate filename to prevent path traversal attacks
    validate_filename(&filename)?;
    
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    // Ensure directory exists
    if !app_data_dir.exists() {
        std::fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    }
    
    let file_path = app_data_dir.join(filename);
    
    // Additional safety check: ensure the file is still within the app data directory
    if !file_path.starts_with(&app_data_dir) {
        return Err("Invalid file path: path traversal detected".to_string());
    }
    
    std::fs::write(&file_path, content)
        .map_err(|e| format!("Failed to write file: {}", e))
}

#[tauri::command]
async fn delete_data_file(
    app_handle: tauri::AppHandle,
    filename: String,
) -> Result<(), String> {
    // Validate filename to prevent path traversal attacks
    validate_filename(&filename)?;
    
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let file_path = app_data_dir.join(filename);
    
    // Additional safety check: ensure the file is still within the app data directory
    if !file_path.starts_with(&app_data_dir) {
        return Err("Invalid file path: path traversal detected".to_string());
    }
    
    if file_path.exists() {
        std::fs::remove_file(&file_path)
            .map_err(|e| format!("Failed to delete file: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
async fn list_storage_files(app_handle: tauri::AppHandle) -> Result<Vec<String>, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    // Ensure directory exists
    if !app_data_dir.exists() {
        return Ok(vec![]);
    }
    
    let mut files = Vec::new();
    
    match std::fs::read_dir(&app_data_dir) {
        Ok(entries) => {
            for entry in entries {
                match entry {
                    Ok(entry) => {
                        if let Some(file_name) = entry.file_name().to_str() {
                            // Only include JSON files to avoid exposing system files
                            if file_name.ends_with(".json") && file_name.starts_with("doppelkopf-") {
                                files.push(file_name.to_string());
                            }
                        }
                    }
                    Err(e) => {
                        log::warn!("Failed to read directory entry: {}", e);
                        continue;
                    }
                }
            }
        }
        Err(e) => {
            return Err(format!("Failed to read app data directory: {}", e));
        }
    }
    
    Ok(files)
}

#[tauri::command]
async fn get_platform_info() -> Result<serde_json::Value, String> {
    let platform = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    
    Ok(serde_json::json!({
        "platform": platform,
        "arch": arch,
        "version": env!("CARGO_PKG_VERSION")
    }))
}
