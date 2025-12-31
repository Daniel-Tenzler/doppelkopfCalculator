import type { Theme, ColorPalette } from '../theme';

/**
 * Get system theme preference
 */
export function getSystemThemePreference(): Theme {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches ? 'dark' : 'light';
    }
  } catch {
    // Ignore errors
  }
  return 'light';
}

/**
 * Get theme class name for CSS targeting
 */
export function getThemeClassName(theme: Theme): string {
  return `doppelkopf-theme-${theme}`;
}

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeCSS(colors: ColorPalette, theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Add theme class for CSS targeting
  root.setAttribute('data-theme', theme);
  root.className = getThemeClassName(theme);

  // Apply CSS custom properties for styled-components
  root.style.setProperty('--theme-background', colors.background);
  root.style.setProperty('--theme-surface', colors.surface);
  root.style.setProperty('--theme-paper', colors.paper);
  root.style.setProperty('--theme-card', colors.card);
  root.style.setProperty('--theme-text', colors.text);
  root.style.setProperty('--theme-text-secondary', colors.textSecondary);
  root.style.setProperty('--theme-text-muted', colors.textMuted);
  root.style.setProperty('--theme-text-on-surface', colors.textOnSurface);
  root.style.setProperty('--theme-border', colors.border);
  root.style.setProperty('--theme-border-light', colors.borderLight);
  root.style.setProperty('--theme-border-dark', colors.borderDark);
  root.style.setProperty('--theme-player1', colors.player1);
  root.style.setProperty('--theme-player2', colors.player2);
  root.style.setProperty('--theme-player3', colors.player3);
  root.style.setProperty('--theme-player4', colors.player4);
  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-primary-hover', colors.primaryHover);
  root.style.setProperty('--theme-accent', colors.accent);
  root.style.setProperty('--theme-success', colors.success);
  root.style.setProperty('--theme-warning', colors.warning);
  root.style.setProperty('--theme-error', colors.error);
  root.style.setProperty('--theme-winner', colors.winner);
  root.style.setProperty('--theme-loser', colors.loser);
  root.style.setProperty('--theme-spritze-active', colors.spritzeActive);
  root.style.setProperty('--theme-spritze-inactive', colors.spritzeInactive);
  root.style.setProperty('--theme-carry-over', colors.carryOver);
  root.style.setProperty('--theme-shadow', colors.shadow);
  root.style.setProperty('--theme-shadow-light', colors.shadowLight);
  root.style.setProperty('--theme-shadow-heavy', colors.shadowHeavy);
}