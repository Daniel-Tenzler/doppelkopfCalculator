import type { GameState, PersistedState } from '../types';

// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'doppelkopf-game-state',
  THEME: 'doppelkopf-theme'
} as const;

// Default values
const DEFAULT_THEME: 'light' | 'dark' = 'light';

export class LocalStorageError extends Error {
  name = 'LocalStorageError';
  context?: Record<string, unknown>;
  
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    // Sanitize context for production to avoid information disclosure
    this.context = import.meta.env?.MODE === 'production' 
      ? sanitizeErrorContext(context)
      : context;
  }
}

/**
 * Sanitize error context for production to prevent information disclosure
 */
function sanitizeErrorContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) return undefined;
  
  // Only include safe, non-sensitive fields in production
  const sanitized: Record<string, unknown> = {};
  const allowedFields = ['key', 'errorType', 'timestamp', 'functionName'];
  
  for (const field of allowedFields) {
    if (field in context) {
      sanitized[field] = context[field];
    }
  }
  
  return sanitized;
}

/**
 * Create standardized error context with timestamp and function name
 */
function createErrorContext(functionName: string, data: Record<string, unknown>): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    functionName,
    ...data
  };
}

/**
 * Check if localStorage is available in the current environment
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__doppelkopf_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if localStorage has available quota
 */
function hasStorageQuota(data: unknown): boolean {
  try {
    const serialized = JSON.stringify(data);
    const testKey = '__doppelkopf_quota_test__';
    localStorage.setItem(testKey, serialized);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return error instanceof Error && error.name === 'QuotaExceededError';
  }
}

/**
 * Safely serialize data to JSON with error handling
 */
function safeStringify(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new LocalStorageError(
      'Failed to serialize data to JSON',
      createErrorContext('safeStringify', { 
        errorType: error instanceof Error ? error.name : 'Unknown',
        dataType: typeof data
      })
    );
  }
}

/**
 * Safely parse JSON with error handling
 */
function safeParse<T>(json: string): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new LocalStorageError(
      'Failed to parse JSON data',
      createErrorContext('safeParse', { 
        errorType: error instanceof Error ? error.name : 'Unknown'
      })
    );
  }
}

/**
 * Save game state to local storage.
 * 
 * @param state - Game state to persist
 * @throws {LocalStorageError} When storage is unavailable or serialization fails
 */
export function saveGameState(state: GameState): void {
  // Input validation
  if (!state || typeof state !== 'object') {
    throw new LocalStorageError(
      'gameState must be a valid object',
      createErrorContext('saveGameState', { state })
    );
  }

  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, game state will not be persisted');
    return;
  }

  try {
    const serializedState = safeStringify(state);
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, serializedState);
  } catch (error) {
    if (error instanceof LocalStorageError) {
      throw error;
    }
    
    throw new LocalStorageError(
      'Failed to save game state to localStorage',
      createErrorContext('saveGameState', { 
        key: STORAGE_KEYS.GAME_STATE,
        errorType: error instanceof Error ? error.name : 'Unknown'
      })
    );
  }
}

/**
 * Load game state from local storage.
 * 
 * @returns Game state if available, null otherwise
 * @throws {LocalStorageError} When JSON parsing fails
 */
export function loadGameState(): GameState | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, returning null game state');
    return null;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    
    if (serializedState === null) {
      return null; // No saved state exists
    }

    if (serializedState === '') {
      console.warn('Empty game state found in localStorage, clearing it');
      clearGameState();
      return null;
    }

    const state = safeParse<GameState>(serializedState);
    
    // Basic validation of loaded state
    if (!state || typeof state !== 'object') {
      console.warn('Invalid game state found in localStorage, clearing it');
      clearGameState();
      return null;
    }

    return state;
  } catch (error) {
    if (error instanceof LocalStorageError) {
      throw error;
    }
    
    console.error('Error loading game state from localStorage:', error);
    
    // Clear potentially corrupted data
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch {
      // Ignore cleanup errors
    }
    
    return null;
  }
}

/**
 * Clear game state from local storage.
 * 
 * @throws {LocalStorageError} When storage is unavailable
 */
export function clearGameState(): void {
  if (!isLocalStorageAvailable()) {
    throw new LocalStorageError(
      'localStorage is not available',
      createErrorContext('clearGameState', {})
    );
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (error) {
    throw new LocalStorageError(
      'Failed to clear game state from localStorage',
      createErrorContext('clearGameState', { 
        key: STORAGE_KEYS.GAME_STATE,
        errorType: error instanceof Error ? error.name : 'Unknown'
      })
    );
  }
}

/**
 * Save theme preference to local storage.
 * 
 * @param theme - Theme preference ('light' or 'dark')
 * @throws {LocalStorageError} When storage is unavailable or theme is invalid
 */
export function saveTheme(theme: 'light' | 'dark'): void {
  // Input validation
  if (theme !== 'light' && theme !== 'dark') {
    throw new LocalStorageError(
      `Invalid theme: ${theme}. Must be 'light' or 'dark'`,
      createErrorContext('saveTheme', { theme })
    );
  }

  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, theme preference will not be persisted');
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    throw new LocalStorageError(
      'Failed to save theme to localStorage',
      createErrorContext('saveTheme', { 
        key: STORAGE_KEYS.THEME,
        theme,
        errorType: error instanceof Error ? error.name : 'Unknown'
      })
    );
  }
}

/**
 * Load theme preference from local storage.
 * 
 * @returns Theme preference ('light' or 'dark'), defaults to 'light' if not found
 * @throws {LocalStorageError} When storage operations fail critically
 */
export function loadTheme(): 'light' | 'dark' {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, using default theme');
    return DEFAULT_THEME;
  }

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    
    if (savedTheme === null) {
      return DEFAULT_THEME;
    }

    // Validate the loaded theme
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Invalid theme found, clear it and return default
    console.warn(`Invalid theme "${savedTheme}" found in localStorage, clearing it`);
    try {
      localStorage.removeItem(STORAGE_KEYS.THEME);
    } catch {
      // Ignore cleanup errors
    }
    return DEFAULT_THEME;
  } catch (error) {
    if (error instanceof LocalStorageError) {
      throw error;
    }
    
    console.error('Error loading theme from localStorage:', error);
    return DEFAULT_THEME;
  }
}

/**
 * Load complete persisted state (game state + theme).
 * This is a convenience function for initialization.
 * 
 * @returns Complete persisted state with defaults for missing data
 */
export function loadPersistedState(): PersistedState {
  try {
    const gameState = loadGameState();
    const theme = loadTheme();
    
    return {
      gameState,
      theme
    };
  } catch (error) {
    console.error('Error loading persisted state, using defaults:', error);
    return {
      gameState: null,
      theme: DEFAULT_THEME
    };
  }
}

/**
 * Clear all Doppelkopf data from local storage.
 * This includes game state and theme preference.
 * 
 * @throws {LocalStorageError} When storage is unavailable
 */
export function clearAllData(): void {
  if (!isLocalStorageAvailable()) {
    throw new LocalStorageError(
      'localStorage is not available',
      createErrorContext('clearAllData', {})
    );
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    localStorage.removeItem(STORAGE_KEYS.THEME);
  } catch (error) {
    throw new LocalStorageError(
      'Failed to clear data from localStorage',
      createErrorContext('clearAllData', { 
        errorType: error instanceof Error ? error.name : 'Unknown'
      })
    );
  }
}

/**
 * Check if any persisted data exists.
 * Useful for determining if a previous game can be resumed.
 * 
 * @returns True if game state exists in localStorage
 */
export function hasPersistedGame(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const gameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return gameState !== null && gameState !== '';
  } catch {
    return false;
  }
}

/**
 * Get storage usage information for debugging.
 * 
 * @returns Object with storage usage details
 */
export function getStorageInfo(): { 
  available: boolean; 
  gameStateExists: boolean; 
  themeExists: boolean; 
  estimatedSize?: number;
  quotaAvailable?: boolean;
  totalKeys?: number;
} {
  const available = isLocalStorageAvailable();
  
  if (!available) {
    return {
      available: false,
      gameStateExists: false,
      themeExists: false
    };
  }

  try {
    const gameStateData = localStorage.getItem(STORAGE_KEYS.GAME_STATE) || '';
    const themeData = localStorage.getItem(STORAGE_KEYS.THEME) || '';
    
    // Get all localStorage keys for debugging
    const totalKeys = Object.keys(localStorage).length;
    
    // Test quota availability
    const quotaAvailable = hasStorageQuota({ test: 'data' });
    
    return {
      available: true,
      gameStateExists: gameStateData !== '',
      themeExists: themeData !== '',
      estimatedSize: gameStateData.length + themeData.length,
      quotaAvailable,
      totalKeys
    };
  } catch {
    return {
      available: true,
      gameStateExists: false,
      themeExists: false
    };
  }
}