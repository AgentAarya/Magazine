/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#b11226',
          black: '#111111',
          white: '#f8f8f8'
        }
      },
      fontFamily: {
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        modern: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
