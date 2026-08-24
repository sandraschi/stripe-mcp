/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stripe: {
          50: '#f4f5f9',
          100: '#e6e9f2',
          500: '#635bff',
          600: '#5469d4',
          700: '#43458b',
          900: '#0a2540',
        }
      }
    },
  },
  plugins: [],
}
