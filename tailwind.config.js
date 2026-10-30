/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#0b6fb5', dark: '#084f82' }, ink: '#0b0f14' },
      fontFamily: { sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
