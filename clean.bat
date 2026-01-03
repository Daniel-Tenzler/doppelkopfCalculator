@echo off
echo Cleaning build artifacts...

:: Clean web build
if exist "dist" (
  echo Removing web build directory...
  rmdir /s /q dist
)

:: Clean Tauri build
if exist "dist-tauri" (
  echo Removing Tauri build directory...
  rmdir /s /q dist-tauri
)

:: Clean Rust build artifacts
if exist "src-tauri\target" (
  echo Removing Rust build artifacts...
  rmdir /s /q src-tauri\target
)

:: Deep clean (optional)
if "%1"=="--deep" (
  echo Removing node_modules...
  rmdir /s /q node_modules
  echo Run 'npm install' to reinstall dependencies
)

echo Clean complete!