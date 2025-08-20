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
        'gold-light': '#E6C770',
        'gold-dark': '#BFA14A',
        dark: '#1A1A1A',
        'warm-gray': '#333333',
        'cream': '#F8F8F4',
        'accent-gray': '#E5E5E5',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.5)',
        'gold-xl': '0 0 60px rgba(212, 175, 55, 0.7)',
        'soft': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #E6C770 0%, #D4AF37 50%, #BFA14A 100%)',
        'gold-gradient-radial': 'radial-gradient(ellipse at center, #E6C770 0%, #D4AF37 50%, #BFA14A 100%)',
        'dark-gradient': 'radial-gradient(ellipse at top left, #232323 60%, #181818 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)',
            transform: 'scale(1.05)'
          },
        },
        'slide-up-fade': {
          'from': { 
            opacity: '0',
            transform: 'translateY(30px) scale(0.95)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionProperty: {
        'all': 'all',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'opacity': 'opacity',
        'shadow': 'box-shadow',
        'transform': 'transform',
      },
      transitionTimingFunction: {
        'bounce-gentle': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
