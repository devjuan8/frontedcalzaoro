/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        dark: '#1A1A1A',
        'warm-gray': '#333333',
        'cream': '#F8F8F4',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
