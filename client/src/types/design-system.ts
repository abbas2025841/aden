// نظام التصميم الموحد لتطبيق عدن لايف
export interface DesignToken {
  value: string;
  description?: string;
}

export interface ColorPalette {
  primary: DesignToken;
  secondary: DesignToken;
  neutral: DesignToken;
  background: DesignToken;
  success: DesignToken;
  warning: DesignToken;
  error: DesignToken;
  info: DesignToken;
}

export const COLORS: ColorPalette = {
  primary: { 
    value: '#0066FF',
    description: 'اللون الأساسي للتطبيق'
  },
  secondary: { 
    value: '#00C853',
    description: 'اللون الثانوي للتطبيق'
  },
  neutral: { 
    value: '#212121',
    description: 'اللون المحايد للنصوص'
  },
  background: { 
    value: '#FAFAFA',
    description: 'لون الخلفية الرئيسي'
  },
  success: { 
    value: '#4CAF50',
    description: 'لون النجاح والعمليات الإيجابية'
  },
  warning: { 
    value: '#FF9800',
    description: 'لون التحذير والتنبيهات'
  },
  error: { 
    value: '#F44336',
    description: 'لون الخطأ والعمليات السلبية'
  },
  info: { 
    value: '#2196F3',
    description: 'لون المعلومات والتفاصيل'
  }
};

export const SPACING = {
  base: { 
    value: '8px',
    description: 'المسافة الأساسية'
  },
  xs: { 
    value: '0.5rem',
    description: 'مسافة صغيرة جداً'
  },
  sm: { 
    value: '1rem',
    description: 'مسافة صغيرة'
  },
  md: { 
    value: '1.5rem',
    description: 'مسافة متوسطة'
  },
  lg: { 
    value: '2rem',
    description: 'مسافة كبيرة'
  },
  xl: { 
    value: '3rem',
    description: 'مسافة كبيرة جداً'
  },
  xxl: { 
    value: '4rem',
    description: 'مسافة ضخمة'
  }
};

export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    arabic: 'Cairo, "Noto Sans Arabic", Arial, sans-serif'
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'  // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
};

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px'
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060
};

// أنماط الأزرار
export const BUTTON_STYLES = {
  primary: {
    default: {
      backgroundColor: COLORS.primary.value,
      color: 'white',
      border: 'none'
    },
    hover: {
      backgroundColor: '#0052CC'
    },
    disabled: {
      backgroundColor: '#E0E0E0',
      color: '#9E9E9E',
      cursor: 'not-allowed'
    }
  },
  secondary: {
    default: {
      backgroundColor: 'transparent',
      color: COLORS.primary.value,
      border: `2px solid ${COLORS.primary.value}`
    },
    hover: {
      backgroundColor: COLORS.primary.value,
      color: 'white'
    },
    disabled: {
      backgroundColor: 'transparent',
      color: '#9E9E9E',
      border: '2px solid #E0E0E0',
      cursor: 'not-allowed'
    }
  },
  success: {
    default: {
      backgroundColor: COLORS.success.value,
      color: 'white',
      border: 'none'
    },
    hover: {
      backgroundColor: '#45A049'
    },
    disabled: {
      backgroundColor: '#E0E0E0',
      color: '#9E9E9E',
      cursor: 'not-allowed'
    }
  },
  warning: {
    default: {
      backgroundColor: COLORS.warning.value,
      color: 'white',
      border: 'none'
    },
    hover: {
      backgroundColor: '#F57C00'
    },
    disabled: {
      backgroundColor: '#E0E0E0',
      color: '#9E9E9E',
      cursor: 'not-allowed'
    }
  },
  error: {
    default: {
      backgroundColor: COLORS.error.value,
      color: 'white',
      border: 'none'
    },
    hover: {
      backgroundColor: '#D32F2F'
    },
    disabled: {
      backgroundColor: '#E0E0E0',
      color: '#9E9E9E',
      cursor: 'not-allowed'
    }
  }
};

// أحجام الأزرار
export const BUTTON_SIZES = {
  sm: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem'
  },
  md: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '0.5rem'
  },
  lg: {
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    borderRadius: '0.75rem'
  }
};

// مكونات التصميم
export interface DesignTokens {
  colors: ColorPalette;
  spacing: typeof SPACING;
  typography: typeof TYPOGRAPHY;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  breakpoints: typeof BREAKPOINTS;
  zIndex: typeof Z_INDEX;
  buttonStyles: typeof BUTTON_STYLES;
  buttonSizes: typeof BUTTON_SIZES;
}

export const DESIGN_TOKENS: DesignTokens = {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  buttonStyles: BUTTON_STYLES,
  buttonSizes: BUTTON_SIZES
};

// مساعدات CSS
export const createCSSVariables = () => {
  const cssVars: Record<string, string> = {};
  
  // ألوان
  Object.entries(COLORS).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value;
  });
  
  // المسافات
  Object.entries(SPACING).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = typeof value === 'string' ? value : value.value;
  });
  
  // أحجام الخط
  Object.entries(TYPOGRAPHY.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });
  
  // الأوزان
  Object.entries(TYPOGRAPHY.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-weight-${key}`] = value;
  });
  
  // الحدود
  Object.entries(BORDER_RADIUS).forEach(([key, value]) => {
    cssVars[`--border-radius-${key}`] = value;
  });
  
  // الظلال
  Object.entries(SHADOWS).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });
  
  return cssVars;
};

// مساعدات للاستخدام في المكونات
export const getColor = (color: keyof ColorPalette) => COLORS[color];
export const getSpacing = (size: keyof typeof SPACING) => SPACING[size];
export const getFontSize = (size: keyof typeof TYPOGRAPHY.fontSize) => TYPOGRAPHY.fontSize[size];
export const getBorderRadius = (size: keyof typeof BORDER_RADIUS) => BORDER_RADIUS[size];
export const getShadow = (size: keyof typeof SHADOWS) => SHADOWS[size];
export const getButtonStyle = (variant: keyof typeof BUTTON_STYLES) => BUTTON_STYLES[variant];
export const getButtonSize = (size: keyof typeof BUTTON_SIZES) => BUTTON_SIZES[size];

// مساعدات للاستجابة
export const mediaQuery = (breakpoint: keyof typeof BREAKPOINTS) => 
  `@media (min-width: ${BREAKPOINTS[breakpoint]})`;

// مساعدات للظلال
export const createShadow = (level: keyof typeof SHADOWS, color: string = 'rgba(0, 0, 0, 0.1)') => 
  SHADOWS[level].replace('rgba(0, 0, 0, 0.1)', color);

// مساعدات للألوان
export const lightenColor = (color: string, _amount: number) => {
  // تطبيق تفتيح اللون (يمكن تحسينه باستخدام مكتبة color)
  return color;
};

export const darkenColor = (color: string, _amount: number) => {
  // تطبيق تغميق اللون (يمكن تحسينه باستخدام مكتبة color)
  return color;
};
