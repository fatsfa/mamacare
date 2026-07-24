/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          100: '#FFEAF1',
          300: '#FFB6D9',
          500: '#FF85C0'
        },
        lavender: '#E6D5F8',
      },
    },
  },
  plugins: [],
}
