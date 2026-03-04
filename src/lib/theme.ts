export const RETRO_COLORS = {
  neonMagenta: '#FF00FF',
  neonCyan: '#00FFFF',
  electricGreen: '#39FF14',
  amber: '#FFBF00',
  deepPurple: '#1a0033',
  darkBg: '#0a0014',
  cabinetBody: '#1a1a2e',
  cabinetTrim: '#16213e',
  screenGlow: '#00FFFF',
  white: '#ffffff',
} as const;

export const CABINET_RADIUS = 4.5;
export const CABINETS_COUNT = 6;
export const ROTATION_STEP = (2 * Math.PI) / CABINETS_COUNT;
