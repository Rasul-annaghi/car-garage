/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'garage-red': '#E63946',
        'garage-dark': '#111111',
        'garage-light': '#F8F5F0',
        'garage-card': '#1A1A1A',
        'garage-border': '#2A2A2A',
        'garage-muted': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
