/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050505',
          900: '#0a0a0b',
          800: '#111113',
          700: '#1a1a1e',
          600: '#26262c',
          500: '#3a3a42',
        },
        gold: {
          50: '#fff8e6',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffb300',
          600: '#ff9100',
          700: '#ff6f00',
          800: '#ff3d00',
        },
        ember: {
          400: '#ff7043',
          500: '#ff5722',
          600: '#f4511e',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        sans: ['"Rajdhani"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        gold: '0 0 20px rgba(255, 179, 0, 0.35)',
        'gold-lg': '0 0 40px rgba(255, 179, 0, 0.45)',
        ember: '0 0 24px rgba(255, 87, 34, 0.4)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #ffb300 0%, #ff6f00 100%)',
        'dark-grid': 'linear-gradient(rgba(255,179,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,179,0,0.04) 1px, transparent 1px)',
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(255, 179, 0, 0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(255, 179, 0, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
