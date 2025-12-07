/**
 * Theme Configuration
 * TypeScript theme object with type safety
 */

export const colors = {
  primary: {
    purple: '#8B5CF6',
    blue: '#3B82F6',
    green: '#10B981',
    red: '#EF4444',
    yellow: '#F59E0B',
    indigo: '#6366F1',
    pink: '#EC4899',
    teal: '#14B8A6',
  },
  
  background: {
    light: {
      from: '#EFF6FF',
      via: '#FFFFFF',
      to: '#ECFDF5',
    },
    dark: {
      from: '#111827',
      via: '#1F2937',
      to: '#111827',
    },
  },
  
  card: {
    background: 'rgba(139, 92, 246, 0.8)',
    backgroundHover: 'rgba(139, 92, 246, 0.9)',
    border: '#9333EA',
    shadow: 'rgba(139, 92, 246, 0.2)',
  },
  
  categories: {
    mathematics: '#2563EB',
    arabic: '#16A34A',
    physics: '#9333EA',
    history: '#EA580C',
    chemistry: '#DC2626',
    geography: '#4F46E5',
    english: '#CA8A04',
    biology: '#DB2777',
    science: '#0D9488',
    islamic: '#059669',
    social: '#D97706',
    national: '#E11D48',
    quran: '#0D9488',
    faith: '#059669',
    fiqh_hadith: '#059669',
    seerah: '#059669',
    sociology: '#0891B2',
    computer: '#475569',
    philosophy: '#9333EA',
    psychology: '#4F46E5',
  },
  
  text: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
    dark: '#111827',
  },
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const radius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms ease-out',
  normal: '300ms ease-out',
  slow: '500ms ease-out',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  card: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
  cardHover: '0 20px 25px -5px rgba(139, 92, 246, 0.2)',
} as const;

export const breakpoints = {
  mobile: {
    sm: 320,
    md: 375,
    lg: 540,
  },
  tablet: {
    sm: 540,
    lg: 768,
  },
  desktop: {
    sm: 1024,
    lg: 1280,
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

export const grid = {
  columns: {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
  gap: {
    mobile: spacing.md,
    tablet: spacing.lg,
    desktop: spacing.xl,
  },
} as const;

export const bookCard = {
  aspectRatio: '3 / 4',
  coverHeight: '200px',
} as const;

export const animation = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  easing: {
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const opacity = {
  disabled: 0.5,
  hover: 0.8,
  active: 0.9,
} as const;

export const border = {
  thin: '1px',
  medium: '2px',
  thick: '4px',
} as const;

// ===== Type Definitions =====

export type ColorCategory = keyof typeof colors.categories;
export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
export type TransitionKey = keyof typeof transitions;
export type ShadowKey = keyof typeof shadows;
export type BreakpointDevice = keyof typeof breakpoints;

// ===== Helper Functions =====

/**
 * Get category color by category key
 * @param category - Category key (e.g., 'mathematics', 'arabic')
 * @returns Hex color string
 */
export const getCategoryColor = (category: ColorCategory): string => {
  return colors.categories[category] || colors.categories.science;
};

/**
 * Get Tailwind CSS class for category background
 * @param category - Category key
 * @returns Tailwind class string
 */
export const getCategoryBgClass = (category: ColorCategory): string => {
  const colorMap: Record<ColorCategory, string> = {
    mathematics: 'bg-blue-600',
    arabic: 'bg-green-600',
    physics: 'bg-purple-600',
    history: 'bg-orange-600',
    chemistry: 'bg-red-600',
    geography: 'bg-indigo-600',
    english: 'bg-yellow-600',
    biology: 'bg-pink-600',
    science: 'bg-teal-600',
    islamic: 'bg-emerald-600',
    social: 'bg-amber-600',
    national: 'bg-rose-600',
    quran: 'bg-teal-600',
    faith: 'bg-emerald-600',
    fiqh_hadith: 'bg-emerald-600',
    seerah: 'bg-emerald-600',
    sociology: 'bg-cyan-600',
    computer: 'bg-slate-600',
    philosophy: 'bg-purple-600',
    psychology: 'bg-indigo-600',
  };
  
  return colorMap[category] || 'bg-gray-600';
};

/**
 * Get responsive grid columns based on viewport width
 * @param width - Viewport width in pixels
 * @returns Number of columns
 */
export const getGridColumns = (width: number): number => {
  if (width < breakpoints.tablet.sm) {
    return grid.columns.mobile;
  } else if (width < breakpoints.tablet.lg) {
    return grid.columns.tablet;
  } else {
    return grid.columns.desktop;
  }
};

/**
 * Check if viewport is mobile
 * @param width - Viewport width in pixels
 * @returns Boolean
 */
export const isMobile = (width: number): boolean => {
  return width < breakpoints.tablet.sm;
};

/**
 * Check if viewport is tablet
 * @param width - Viewport width in pixels
 * @returns Boolean
 */
export const isTablet = (width: number): boolean => {
  return width >= breakpoints.tablet.sm && width < breakpoints.desktop.sm;
};

/**
 * Check if viewport is desktop
 * @param width - Viewport width in pixels
 * @returns Boolean
 */
export const isDesktop = (width: number): boolean => {
  return width >= breakpoints.desktop.sm;
};

/**
 * Get CSS variable value
 * @param variable - CSS variable name (without --)
 * @returns CSS variable string
 */
export const cssVar = (variable: string): string => {
  return `var(--${variable})`;
};

/**
 * Create transition string
 * @param properties - CSS properties to transition
 * @param duration - Duration key
 * @returns CSS transition string
 */
export const createTransition = (
  properties: string[],
  duration: TransitionKey = 'normal'
): string => {
  return properties.map(prop => `${prop} ${transitions[duration]}`).join(', ');
};

// ===== Export default theme object =====

export const theme = {
  colors,
  spacing,
  radius,
  transitions,
  shadows,
  breakpoints,
  zIndex,
  grid,
  bookCard,
  animation,
  opacity,
  border,
} as const;

export default theme;
