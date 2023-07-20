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
    extend: theme.custom || theme.default,
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
  plugins: [import('@tailwindcss/forms')]
}
