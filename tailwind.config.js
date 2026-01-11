/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefdf9',
          100: '#fefbf3',
          200: '#fdf4d3',
          300: '#fbebb3',
          400: '#f7d774',
          500: '#f3c234',
          600: '#dba82f',
          700: '#b8872a',
          800: '#946a25',
          900: '#7a5720',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};