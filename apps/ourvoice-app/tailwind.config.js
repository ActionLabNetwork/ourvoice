/** @type {import('tailwindcss').Config} */
import fs from 'fs'
import yaml from 'js-yaml'
const theme = yaml.load(fs.readFileSync('./src/config/theme-config.yml', 'utf8'))
// console.log(theme)

export default {
  mode: 'jit', // Just in time compiler
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: theme.default || theme.custom,
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '425px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '2560px'
      }
    }
  },
  plugins: [import('@tailwindcss/forms')]
}
