/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aqua: {
          50: '#f0fdfd',
          100: '#ccfbfb',
          200: '#99f6f6',
          300: '#5ceaea',
          400: '#2dd6d6',
          500: '#14b8b8',
          600: '#0d9999',
          700: '#0d7777',
          800: '#0e5c5c',
          900: '#0f4848',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d2dae7',
          300: '#a7b9d3',
          400: '#7694ba',
          500: '#5276a3',
          600: '#405d88',
          700: '#364c6f',
          800: '#2f415d',
          900: '#2b394f',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 