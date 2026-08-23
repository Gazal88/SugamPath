// SugamPath design tokens.
// Palette is grounded in real accessibility infrastructure, not a generic UI-kit default:
// - accent (#F5B800) is the actual colour used on tactile paving tiles in Indian metro/rail stations
// - green/red follow pedestrian-signal convention (walk / don't-walk), not generic UI success/danger
// Do not add new colors ad-hoc in screens — extend this file so the system stays coherent.

export const color = {
  paper: '#F1F0EB',
  paperRaised: '#FBFAF6',
  ink: '#1B2430',
  inkSoft: '#4B5563',
  line: 'rgba(27,36,48,0.10)',
  lineStrong: 'rgba(27,36,48,0.18)',

  accent: '#F5B800',
  accentInk: '#4A3800',

  green: '#2F7A4F',
  greenBg: '#E4F1E8',

  red: '#D64550',
  redBg: '#FBE7E8',

  blue: '#3E5C76',
  blueBg: '#E7ECF1',

  white: '#FFFFFF',
};

// Font family keys — must match the keys used when loading fonts via useFonts() in App.tsx
export const font = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
  monoSemibold: 'IBMPlexMono_600SemiBold',
};

export const type = {
  h1: { fontFamily: font.display, fontSize: 26, lineHeight: 32, color: color.ink },
  h2: { fontFamily: font.display, fontSize: 18, lineHeight: 24, color: color.ink },
  h3: { fontFamily: font.displayMedium, fontSize: 15, lineHeight: 20, color: color.ink },
  body: { fontFamily: font.body, fontSize: 14, lineHeight: 20, color: color.ink },
  bodyMedium: { fontFamily: font.bodyMedium, fontSize: 14, lineHeight: 20, color: color.ink },
  caption: { fontFamily: font.body, fontSize: 12, lineHeight: 16, color: color.inkSoft },
  eyebrow: { fontFamily: font.mono, fontSize: 11, letterSpacing: 0.6, color: color.inkSoft, textTransform: 'uppercase' as const },
  score: { fontFamily: font.monoSemibold, fontSize: 16, color: color.ink },
  scoreLarge: { fontFamily: font.monoSemibold, fontSize: 30, color: color.ink },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };

export const radius = { sm: 8, md: 14, lg: 18, xl: 24, pill: 999 };

// Accessibility baseline — every tappable element must be at least this size.
// (WCAG 2.5.5 / Android accessibility guidance: 44x44dp minimum, we round up to 48.)
export const MIN_TAP_TARGET = 48;

export function scoreColor(scoreValue: number): { fg: string; track: string } {
  if (scoreValue >= 75) return { fg: color.green, track: color.line };
  if (scoreValue >= 45) return { fg: color.accent, track: color.line };
  return { fg: color.red, track: color.line };
}
