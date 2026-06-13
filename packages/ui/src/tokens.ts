/**
 * Stokoloji tasarım token'ları — TEK kaynak.
 *
 * Rakip teardown analizinden türetildi (bkz. rakip-tasarim-teardown.md):
 * petrol/koyu lacivert ana renk + tek teal vurgu, açık tema, sonuç sayısı
 * için monospace. Bu paket iki siteye de taşınabilir; renk/tipografi
 * değişiklikleri yalnızca burada yapılır ve Tailwind preset'i üzerinden akar.
 */

export const colors = {
  // Ana marka — petrol / koyu lacivert
  brand: {
    50: '#eef4fa',
    100: '#d6e4f0',
    500: '#1e4e79',
    700: '#163a5c',
    900: '#0f2a43', // ana renk
  },
  // Tek vurgu rengi — teal (sadece CTA + sonuç vurgusu)
  accent: {
    400: '#2cc3c0',
    500: '#0ea5a4',
    600: '#0c8a89',
  },
  ink: '#0f2a43',
  muted: '#5b6b7b',
  line: '#e2e8f0',
  surface: '#ffffff',
  canvas: '#f7fafc',
} as const;

export const fonts = {
  sans: 'var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif',
  mono: 'var(--font-mono), "JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
} as const;

export const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

export const tokens = { colors, fonts, radii } as const;
export type Tokens = typeof tokens;
