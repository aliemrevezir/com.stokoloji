import type { Config } from 'tailwindcss';
// Paylaşılan preset — token'lar @stokoloji/ui'den gelir (iki site de aynı dili kullanır).
import preset from '@stokoloji/ui/tailwind-preset';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx,mdx}',
    // Paylaşılan UI paketindeki sınıflar da taransın.
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
