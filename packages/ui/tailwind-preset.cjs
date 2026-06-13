/**
 * Paylaşılan Tailwind preset'i. Token'ları Tailwind tema değerlerine bağlar.
 * Her iki site de bu preset'i kullanarak aynı tasarım dilini paylaşır.
 *
 * NOT: Token değerleri src/tokens.ts ile elle senkron tutulur (Tailwind config
 * CJS bağlamında TS import edilemediği için). Renk değiştiğinde iki dosyada da
 * güncellenir — kaynak tokens.ts'tir.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4fa',
          100: '#d6e4f0',
          500: '#1e4e79',
          700: '#163a5c',
          900: '#0f2a43',
        },
        accent: {
          400: '#2cc3c0',
          500: '#0ea5a4',
          600: '#0c8a89',
        },
        ink: '#0f2a43',
        muted: '#5b6b7b',
        line: '#e2e8f0',
        canvas: '#f7fafc',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
};
