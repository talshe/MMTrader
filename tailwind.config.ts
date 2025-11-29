import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['apps/web/src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3b82f6',
          accent: '#22d3ee'
        }
      }
    }
  },
  plugins: []
};

export default config;

