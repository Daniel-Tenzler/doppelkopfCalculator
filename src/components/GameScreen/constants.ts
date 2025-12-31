// Grid layout constants for RoundRow - optimized for modern desktop
export const GRID_LAYOUT = {
  COLUMNS: '70px repeat(4, 1fr) 120px 180px',
  GAP: '16px',
  PADDING: '18px',
} as const;

// Component size constants - modern desktop sizing
export const COMPONENT_SIZES = {
  ROUND_NUMBER_WIDTH: '70px',
  SPRITZE_DISPLAY_WIDTH: '120px',
  SPRITZE_CONTROLS_WIDTH: '180px',
  CHECKBOX_SIZE: '22px',
  SMALL_CHECKBOX_SIZE: '16px',
  MIN_CELL_HEIGHT: '56px',
  SIDEBAR_WIDTH: '360px',
  TABLE_MIN_HEIGHT: '400px',
} as const;

// Layout constants - modern desktop spacing
export const LAYOUT = {
  CONTAINER_MAX_WIDTH: '1440px',
  CONTAINER_PADDING_X: '32px',
  CONTAINER_PADDING_Y: '40px',
  SECTION_GAP: '32px',
  CARD_PADDING: '16px',
  BORDER_RADIUS: '12px',
  BORDER_RADIUS_LARGE: '16px',
} as const;

// No animations - instant transitions only
export const ANIMATIONS = {
  TRANSITION_DURATION: '0s',
  TRANSITION_EASE: 'none',
} as const;

// Z-index values
export const Z_INDEX = {
  ACTION_BUTTON: 10,
  MODAL_OVERLAY: 100,
  SIDEBAR: 20,
  TABLE_HEADER: 5,
} as const;