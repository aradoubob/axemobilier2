/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'axe-blue': '#1B365D',
        'axe-gold': '#C5A572',
      },
    },
  },
  plugins: [],
};