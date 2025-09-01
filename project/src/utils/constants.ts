export const APP_NAME = 'Freedom';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  UI_BUILDER: '/ui-builder',
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  accent: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
} as const;

export const FONT_FAMILIES = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Georgia', 'serif'],
  mono: ['Monaco', 'Consolas', 'monospace'],
} as const;

export const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
} as const;
