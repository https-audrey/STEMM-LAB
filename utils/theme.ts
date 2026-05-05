export const COLORS = {
  // Space background (from design spec)
  spaceDark: '#08121E',
  spaceDeep: '#060F19',
  spaceMid: '#07181F',
  spaceGrad1: '#060F19',
  spaceGrad2: '#07181F',
  spaceGrad3: '#08121E',

  // Background
  bgGray: '#cdcccc',

  // Star colors
  starYellow: '#E8C96D',
  starYellowLight: '#F5E097',

  // Asteroid / rock
  asteroidGray: '#9C9BA1',
  asteroidMid: '#717075',
  asteroidLight: '#D9D9D9',
  asteroidDark: '#677179',
  rockDark: '#000000',

  // Text / UI
  white: '#FFFFFF',
  offWhite: '#F0F0F0',
  logoText: '#FFFFFF',
  darkText: '#08121e',
  bodyText: '#000810',
  descText: '#07181f',

  // Input
  inputBg: '#ffffff',
  inputBorder: '#cccccc',
  inputText: '#333333',
  placeholderText: '#676767',

  // Cards
  cardBg: 'rgba(255,255,255,0.10)',
  cardBorder: 'rgba(255,255,255,0.20)',
  taglineBg: 'rgba(180,180,200,0.18)',
  taglineBorder: 'rgba(255,255,255,0.25)',

  // Bottom nav
  navBg: '#3f5765',

  // Status
  error: '#ff6b6b',
  success: '#4ade80',

  // Subject colors
  physics: '#e8f4fd',
  biology: '#d4edda',
  chemistry: '#fff3cd',
  maths: '#f8d7da',
} as const;

export type ColorKey = keyof typeof COLORS;

export const FONTS = {
  title: 'ShortStack_400Regular',
  heading: 'DynaPuff_400Regular',
  ui: 'Oliver-Regular',
} as const;

export type FontKey = keyof typeof FONTS;
