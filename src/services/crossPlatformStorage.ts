/**
 * Detects if the app is running in Tauri desktop environment
 */
export function isTauriApp(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

/**
 * Cross-platform storage service that works with both localStorage (web) and file system (Tauri)
 */
export class CrossPlatformStorage {
  private tauri: { invoke: (command: string, args?: Record<string, unknown>) => Promise<unknown> } | null = null;

  constructor() {
    // Load Tauri API if available
    if (isTauriApp()) {
      this.initializeTauri();
    }
  }

  private async initializeTauri(): Promise<void> {
    try {
      // Dynamically import Tauri modules to avoid bundling issues in web
      const { invoke } = await import('@tauri-apps/api/core');
      
      // Ensure app data directory exists using our custom command
      await invoke('ensure_app_data_dir');
      
      this.tauri = { invoke };
    } catch (error) {
      console.warn('Failed to initialize Tauri storage:', error);
      this.tauri = null;
    }
  }

/**
 * Save data to storage (localStorage or file system)
 */
  async saveData(key: string, data: unknown): Promise<void> {
    const serialized = JSON.stringify(data);

    if (this.tauri && isTauriApp()) {
      try {
        await this.tauri.invoke('write_data_file', {
          filename: `${key}.json`,
          content: serialized,
        });
      } catch (error) {
        console.error('Failed to save data to file system:', error);
        // Fallback to localStorage
        this.saveToLocalStorage(key, serialized);
      }
    } else {
      this.saveToLocalStorage(key, serialized);
    }
  }

/**
 * Load data from storage (localStorage or file system)
 */
  async loadData<T>(key: string): Promise<T | null> {
    if (this.tauri && isTauriApp()) {
      try {
        const content = await this.tauri.invoke('read_data_file', {
          filename: `${key}.json`,
        });
        return JSON.parse(content as string) as T;
      } catch (error) {
        console.warn('Failed to load data from file system:', error);
        // Fallback to localStorage
        return this.loadFromLocalStorage<T>(key);
      }
    } else {
      return this.loadFromLocalStorage<T>(key);
    }
  }

  /**
   * Delete data from storage
   */
  async deleteData(key: string): Promise<void> {
    if (this.tauri && isTauriApp()) {
      try {
        await this.tauri.invoke('delete_data_file', {
          filename: `${key}.json`,
        });
      } catch (error) {
        console.warn('Failed to delete data from file system:', error);
        // Fallback to localStorage
        this.deleteFromLocalStorage(key);
      }
    } else {
      this.deleteFromLocalStorage(key);
    }
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<void> {
    if (this.tauri && isTauriApp()) {
      try {
        const files = await this.getStorageFiles();
        for (const file of files) {
          await this.tauri.invoke('delete_data_file', {
            filename: file,
          });
        }
      } catch (error) {
        console.warn('Failed to clear file system data:', error);
        // Fallback to localStorage
        this.clearAllLocalStorage();
      }
    } else {
      this.clearAllLocalStorage();
    }
  }

  private saveToLocalStorage(key: string, data: string): void {
    try {
      localStorage.setItem(key, data);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw new Error(`Failed to save data to localStorage: ${error}`);
    }
  }

  private loadFromLocalStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) as T : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  private deleteFromLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to delete from localStorage:', error);
    }
  }

  private clearAllLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('doppelkopf-')
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  private async getStorageFiles(): Promise<string[]> {
    if (!this.tauri) return [];
    
    try {
      const files = await this.tauri.invoke('list_storage_files') as string[];
      return files || [];
    } catch (error) {
      console.warn('Failed to list storage files:', error);
      return [];
    }
  }
}

// Create singleton instance
export const storage = new CrossPlatformStorage();

/**
 * Enhanced storage functions using the cross-platform storage
 */
export async function saveGameState(state: unknown): Promise<void> {
  await storage.saveData('doppelkopf-game-state', state);
}

export async function loadGameState(): Promise<unknown | null> {
  return await storage.loadData('doppelkopf-game-state');
}

export async function clearGameState(): Promise<void> {
  await storage.deleteData('doppelkopf-game-state');
}

export async function saveTheme(theme: 'light' | 'dark'): Promise<void> {
  await storage.saveData('doppelkopf-theme', theme);
}

export async function loadTheme(): Promise<'light' | 'dark'> {
  const theme = await storage.loadData<'light' | 'dark'>('doppelkopf-theme');
  return theme || 'light';
}

export async function clearAllData(): Promise<void> {
  await storage.clearAllData();
}

export async function hasPersistedGame(): Promise<boolean> {
  const gameState = await loadGameState();
  return gameState !== null;
}