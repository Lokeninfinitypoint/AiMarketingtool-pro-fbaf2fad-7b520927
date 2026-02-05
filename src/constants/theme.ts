// MarketingTool Theme - Dark Mode (Liquide Design System)
export const Colors = {
  // Primary Brand Colors (Deep Purple)
  primary: '#16132B',
  primaryLight: '#1E1A3D',
  primaryDark: '#0C0B18',

  // Secondary Colors (Orange/Gold - CTAs)
  secondary: '#F7541E',
  secondaryLight: '#FF6B35',
  secondaryDark: '#E34512',

  // Accent Colors (Purple/Violet)
  accent: '#6441A5',
  accentLight: '#851EFF',
  accentDark: '#570BE4',

  // Success/Error/Warning (Liquide palette)
  success: '#33D37D',
  successLight: '#40D946',
  error: '#FF4B4B',
  errorLight: '#FF5166',
  warning: '#F39C12',
  warningLight: '#FBC04C',
  info: '#2196F3',

  // Background Colors (Dark Theme - Liquide)
  background: '#0C0B18',
  backgroundSecondary: '#121212',
  backgroundTertiary: '#1D1D1D',
  card: '#1A1A2E',
  cardHover: '#2C2C2C',

  // Surface Colors
  surface: '#121212',
  surfaceLight: '#1D1D1D',
  surfaceDark: '#0C0B18',

  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',
  textMuted: '#4D4D4D',
  textInverse: '#0C0B18',

  // Border Colors
  border: '#2A2A2A',
  borderLight: '#3D3D3D',
  borderFocus: '#F7541E',

  // Gradient Colors
  gradientStart: '#16132B',
  gradientEnd: '#3D2914',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassLight: 'rgba(255, 255, 255, 0.08)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
  glassCard: 'rgba(26, 26, 46, 0.7)',
  glassAccent: 'rgba(100, 65, 165, 0.15)',

  // Transparent
  transparent: 'transparent',

  // White/Black
  white: '#FFFFFF',
  black: '#000000',

  // Additional Liquide Colors
  gold: '#FD9707',
  green: '#02b875',
  purple: '#AF15C3',
  blue: '#007AFF',
  cyan: '#00D9FF',
};

export const Gradients: Record<string, readonly [string, string, ...string[]]> = {
  primary: ['#16132B', '#0C0B18'] as const,
  secondary: ['#F7541E', '#E34512'] as const,
  accent: ['#6441A5', '#851EFF'] as const,
  card: ['#1A1A2E', '#121212'] as const,
  button: ['#F7541E', '#FF6B35'] as const,
  success: ['#33D37D', '#02b875'] as const,
  dark: ['#0C0B18', '#16132B'] as const,
  premium: ['#3D2914', '#16132B'] as const,
  gold: ['#FD9707', '#F39C12'] as const,
  purple: ['#6441A5', '#AF15C3'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  title: 28,
  header: 36,
};

export const FontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#F7541E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glowPurple: {
    shadowColor: '#6441A5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glowGreen: {
    shadowColor: '#33D37D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  glassSubtle: {
    shadowColor: '#6441A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Glassmorphism style helper
export const GlassStyle = {
  card: {
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
  cardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: 'rgba(247, 84, 30, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
};

export const Theme = {
  colors: Colors,
  gradients: Gradients,
  spacing: Spacing,
  fontSize: FontSize,
  fontFamily: FontFamily,
  borderRadius: BorderRadius,
  shadow: Shadow,
};

export default Theme;
