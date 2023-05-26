/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ourvoice-purple': '#5267DF',
        'ourvoice-red': '#FA5959',
        'ourvoice-blue': '#242A45',
        'ourvoice-grey': '#9194A2',
        'ourvoice-white': '#f7f7f7'
      }
    },
    fontFamily: {
      Poppins: ['Poppins, sans-serif']
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1124px',
        xl: '1124px',
        '2xl': '1124px'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
