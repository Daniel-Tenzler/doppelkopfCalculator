#!/bin/bash

# Clean build artifacts for both web and desktop versions

echo "Cleaning build artifacts..."

# Clean web build
if [ -d "dist" ]; then
  echo "Removing web build directory..."
  rm -rf dist
fi

# Clean Tauri build
if [ -d "dist-tauri" ]; then
  echo "Removing Tauri build directory..."
  rm -rf dist-tauri
fi

# Clean Rust build artifacts
if [ -d "src-tauri/target" ]; then
  echo "Removing Rust build artifacts..."
  rm -rf src-tauri/target
fi

# Clean node modules (optional)
if [ "$1" = "--deep" ]; then
  echo "Removing node_modules..."
  rm -rf node_modules
  echo "Run 'npm install' to reinstall dependencies"
fi

echo "Clean complete!"