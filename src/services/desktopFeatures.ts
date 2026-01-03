/**
 * Desktop-specific utilities and features for Tauri integration
 */

import { isTauriApp } from './crossPlatformStorage';

/**
 * Check if the app is running in Tauri desktop environment
 */
export function isDesktop(): boolean {
  return isTauriApp();
}

/**
 * Get platform information for desktop-specific behavior
 */
export async function getPlatformInfo(): Promise<{
  platform: string;
  arch: string;
  version?: string;
} | null> {
  if (!isDesktop()) {
    return null;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const result = await invoke('get_platform_info');
    return result as {
      platform: string;
      arch: string;
      version?: string;
    };
  } catch (error) {
    console.warn('Failed to get platform info:', error);
    return null;
  }
}

/**
 * Show a desktop notification (Tauri only)
 */
export async function showNotification(title: string, body?: string): Promise<void> {
  if (!isDesktop()) {
    // Fallback to browser notification
    if ('Notification' in window) {
      new Notification(title, { body });
    }
    return;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('show_notification', { title, body });
  } catch (error) {
    console.warn('Failed to show desktop notification:', error);
    // Fallback to browser notification
    if ('Notification' in window) {
      new Notification(title, { body });
    }
  }
}

/**
 * Minimize the application window (Tauri only)
 */
export async function minimizeWindow(): Promise<void> {
  if (!isDesktop()) return;

  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const window = getCurrentWindow();
    await window.minimize();
  } catch (error) {
    console.warn('Failed to minimize window:', error);
  }
}

/**
 * Maximize/Unmaximize the application window (Tauri only)
 */
export async function toggleMaximizeWindow(): Promise<void> {
  if (!isDesktop()) return;

  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const window = getCurrentWindow();
    
    if (await window.isMaximized()) {
      await window.unmaximize();
    } else {
      await window.maximize();
    }
  } catch (error) {
    console.warn('Failed to toggle window maximize:', error);
  }
}

/**
 * Close the application window (Tauri only)
 */
export async function closeWindow(): Promise<void> {
  if (!isDesktop()) return;

  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const window = getCurrentWindow();
    await window.close();
  } catch (error) {
    console.warn('Failed to close window:', error);
  }
}

/**
 * Check if window is currently maximized (Tauri only)
 */
export async function isWindowMaximized(): Promise<boolean> {
  if (!isDesktop()) return false;

  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const window = getCurrentWindow();
    return await window.isMaximized();
  } catch {
    return false;
  }
}

/**
 * Get app version information
 */
export async function getAppVersion(): Promise<string | null> {
  if (!isDesktop()) {
    return null;
  }

  try {
    const { getVersion } = await import('@tauri-apps/api/app');
    return await getVersion();
  } catch {
    return null;
  }
}

/**
 * Get app name
 */
export async function getAppName(): Promise<string | null> {
  if (!isDesktop()) {
    return null;
  }

  try {
    const { getName } = await import('@tauri-apps/api/app');
    return await getName();
  } catch {
    return null;
  }
}

/**
 * Open external URL in system browser
 */
export async function openUrl(url: string): Promise<void> {
  if (!isDesktop()) {
    window.open(url, '_blank');
    return;
  }

  try {
    const { open } = await import('@tauri-apps/plugin-shell');
    await open(url);
  } catch (error) {
    console.warn('Failed to open URL:', error);
    // Fallback to browser
    window.open(url, '_blank');
  }
}

/**
 * Check if desktop is available and show appropriate messaging
 */
export function checkDesktopAvailability(): {
  isDesktop: boolean;
  message: string;
} {
  const desktop = isDesktop();
  
  return {
    isDesktop: desktop,
    message: desktop 
      ? 'Desktop features are available'
      : 'Running in web browser - some desktop features are unavailable'
  };
}