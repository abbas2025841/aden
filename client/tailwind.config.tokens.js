const tokens = require('./src/design-system/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.stories.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.global.color.primary.value,
        secondary: tokens.global.color.secondary.value,
        neutral: tokens.global.color.neutral.value,
        background: tokens.global.color.background.value,
        success: tokens.global.color.success.value,
        warning: tokens.global.color.warning.value,
        error: tokens.global.color.error.value,
        info: tokens.global.color.info.value,
      },
      spacing: {
        'xs': tokens.global.spacing.xs.value,
        'sm': tokens.global.spacing.sm.value,
        'md': tokens.global.spacing.md.value,
        'lg': tokens.global.spacing.lg.value,
        'xl': tokens.global.spacing.xl.value,
        'xxl': tokens.global.spacing.xxl.value,
      },
      fontFamily: {
        'primary': [tokens.global.typography.fontFamily.primary.value],
        'arabic': [tokens.global.typography.fontFamily.arabic.value],
      },
      fontSize: {
        'xs': tokens.global.typography.fontSize.xs.value,
        'sm': tokens.global.typography.fontSize.sm.value,
        'base': tokens.global.typography.fontSize.base.value,
        'lg': tokens.global.typography.fontSize.lg.value,
        'xl': tokens.global.typography.fontSize.xl.value,
        '2xl': tokens.global.typography.fontSize['2xl'].value,
        '3xl': tokens.global.typography.fontSize['3xl'].value,
        '4xl': tokens.global.typography.fontSize['4xl'].value,
      },
      fontWeight: {
        'normal': tokens.global.typography.fontWeight.normal.value,
        'medium': tokens.global.typography.fontWeight.medium.value,
        'semibold': tokens.global.typography.fontWeight.semibold.value,
        'bold': tokens.global.typography.fontWeight.bold.value,
      },
      lineHeight: {
        'tight': tokens.global.typography.lineHeight.tight.value,
        'normal': tokens.global.typography.lineHeight.normal.value,
        'relaxed': tokens.global.typography.lineHeight.relaxed.value,
      },
      borderRadius: {
        'sm': tokens.global.borderRadius.sm.value,
        'base': tokens.global.borderRadius.base.value,
        'md': tokens.global.borderRadius.md.value,
        'lg': tokens.global.borderRadius.lg.value,
        'xl': tokens.global.borderRadius.xl.value,
        'full': tokens.global.borderRadius.full.value,
      },
      boxShadow: {
        'sm': tokens.global.shadows.sm.value,
        'base': tokens.global.shadows.base.value,
        'md': tokens.global.shadows.md.value,
        'lg': tokens.global.shadows.lg.value,
        'xl': tokens.global.shadows.xl.value,
      },
      screens: {
        'sm': tokens.global.breakpoints.sm.value,
        'md': tokens.global.breakpoints.md.value,
        'lg': tokens.global.breakpoints.lg.value,
        'xl': tokens.global.breakpoints.xl.value,
        '2xl': tokens.global.breakpoints['2xl'].value,
      },
      zIndex: {
        'dropdown': tokens.global.zIndex.dropdown.value,
        'sticky': tokens.global.zIndex.sticky.value,
        'fixed': tokens.global.zIndex.fixed.value,
        'modal': tokens.global.zIndex.modal.value,
        'popover': tokens.global.zIndex.popover.value,
        'tooltip': tokens.global.zIndex.tooltip.value,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
