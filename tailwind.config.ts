import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#001D35',
          800: '#0A2844',
          700: '#0F3260',
        },
        cyan: {
          brand: '#26CFD8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
