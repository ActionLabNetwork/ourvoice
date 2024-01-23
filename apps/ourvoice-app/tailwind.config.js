/** @type {import('tailwindcss').Config} */
import fs from 'fs'
import yaml from 'js-yaml'
const theme = yaml.load(
  fs.readFileSync('./src/config/theme-config.yml', 'utf8'),
)
// console.log(theme)

export default {
  mode: 'jit', // Just in time compiler
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
  ],
  theme: {
    extend: theme.custom || theme.default,
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '425px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '2560px',
      },
    },
    keyframes: {
      'accordion-down': {
        from: { height: 0 },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: 0 },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
  plugins: [import('@tailwindcss/forms'), import('tailwindcss-animate')],
}
