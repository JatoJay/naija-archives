/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006400',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A2E',
        },
        accent: {
          DEFAULT: '#D4AF37',
          foreground: '#1A1A2E',
        },
        dark: '#1A1A2E',
        surface: '#F8F5EE',
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#FFFFFF',
        },
        ibadan: {
          DEFAULT: '#C17F59',
          light: '#E5C5B5',
        },
        enugu: {
          DEFAULT: '#228B22',
          light: '#90EE90',
        },
        kaduna: {
          DEFAULT: '#4169E1',
          light: '#B0C4DE',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        parchment: "url('/assets/textures/parchment.png')",
      },
    },
  },
  plugins: [],
};
