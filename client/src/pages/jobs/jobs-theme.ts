// src/pages/jobs/jobs-theme.ts
// Centralized design theme for the Jobs section to ensure consistency with Aden Live

export const jobsTheme = {
  // Main gradient colors - matching Aden Live's primary theme
  primaryGradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  secondaryGradient: 'bg-gradient-to-br from-orange-50 to-red-50',
  cardGradient: 'bg-gradient-to-br from-white to-orange-50',
  
  // Text colors - consistent with Aden Live
  primaryText: 'text-foreground',
  secondaryText: 'text-muted-foreground',
  accentText: 'text-orange-600',
  whiteText: 'text-white',
  
  // Background colors
  pageBackground: 'bg-background',
  cardBackground: 'bg-card',
  glassBackground: 'bg-white/10 backdrop-blur-sm',
  
  // Border colors
  primaryBorder: 'border-border',
  accentBorder: 'border-orange-200',
  premiumBorder: 'border-2 border-orange-300',
  
  // Button styles - matching Aden Live buttons
  primaryButton: 'bg-orange-600 hover:bg-orange-700 text-white',
  secondaryButton: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
  successButton: 'bg-green-600 hover:bg-green-700 text-white',
  ghostButton: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
  
  // Icon colors
  primaryIcon: 'text-orange-600',
  secondaryIcon: 'text-muted-foreground',
  whiteIcon: 'text-white',
  
  // Special effects
  hoverEffect: 'hover:shadow-lg transition-all duration-300',
  cardHover: 'hover:scale-105 active:scale-95',
  glassEffect: 'backdrop-blur-sm bg-white/10',
  
  // Spacing and sizing
  cardPadding: 'p-4',
  cardPaddingLarge: 'p-6',
  borderRadius: 'rounded-xl',
  borderRadiusSmall: 'rounded-lg',
  
  // Typography - using Aden Live's typography classes
  heading1: 'typography-h1 text-foreground',
  heading2: 'typography-h2 text-foreground',
  heading3: 'typography-h3 text-foreground',
  bodyText: 'typography-body text-muted-foreground',
  captionText: 'typography-caption text-muted-foreground',
  smallText: 'typography-small text-muted-foreground',
  
  // Premium job styling
  premiumJob: {
    background: 'bg-gradient-to-br from-orange-50 to-yellow-50',
    border: 'border-orange-300',
    badge: 'bg-orange-100 text-orange-800',
    icon: 'text-orange-600'
  },
  
  // Category colors for variety while maintaining consistency
  categoryColors: {
    'مبيعات وتسويق': {
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600'
    },
    'سائق': {
      gradient: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600'
    },
    'تقني': {
      gradient: 'from-purple-50 to-violet-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      icon: 'text-purple-600'
    },
    'سياحة ومطاعم': {
      gradient: 'from-orange-50 to-red-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: 'text-orange-600'
    },
    'تعليم': {
      gradient: 'from-yellow-50 to-amber-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600'
    },
    'صحة وطب': {
      gradient: 'from-red-50 to-pink-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600'
    },
    'بناء ومقاولات': {
      gradient: 'from-gray-50 to-slate-50',
      border: 'border-gray-200',
      text: 'text-gray-800',
      icon: 'text-gray-600'
    },
    'أمن وحماية': {
      gradient: 'from-slate-50 to-gray-50',
      border: 'border-slate-200',
      text: 'text-slate-800',
      icon: 'text-slate-600'
    },
    'شحن ونقل': {
      gradient: 'from-indigo-50 to-blue-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      icon: 'text-indigo-600'
    },
    'مالية ومحاسبة': {
      gradient: 'from-cyan-50 to-blue-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800',
      icon: 'text-cyan-600'
    },
    'خدمة عملاء': {
      gradient: 'from-teal-50 to-green-50',
      border: 'border-teal-200',
      text: 'text-teal-800',
      icon: 'text-teal-600'
    },
    'أخرى': {
      gradient: 'from-orange-50 to-red-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: 'text-orange-600'
    }
  }
};

// Helper function to get category-specific colors
export const getCategoryTheme = (category: string) => {
  return jobsTheme.categoryColors[category as keyof typeof jobsTheme.categoryColors] || jobsTheme.categoryColors['أخرى'];
};

// Common component styles
export const commonStyles = {
  // Card base style
  card: `${jobsTheme.cardBackground} ${jobsTheme.cardPadding} ${jobsTheme.borderRadius} ${jobsTheme.primaryBorder} ${jobsTheme.hoverEffect}`,
  
  // Button base style
  button: `touch-target ${jobsTheme.borderRadius} ${jobsTheme.hoverEffect} active:scale-95`,
  
  // Input base style
  input: `w-full ${jobsTheme.cardPadding} ${jobsTheme.borderRadiusSmall} ${jobsTheme.primaryBorder} ${jobsTheme.cardBackground} ${jobsTheme.primaryText} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`,
  
  // Badge base style
  badge: `${jobsTheme.borderRadiusSmall} ${jobsTheme.captionText} font-semibold`,
  
  // Icon container
  iconContainer: `${jobsTheme.borderRadiusSmall} ${jobsTheme.hoverEffect}`
};
