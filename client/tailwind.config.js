/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        boldonse: ['Boldonse', 'sans-serif'],
      }, // ✅ COMMA here
      colors: {
        'bg-secondary': '#f4f4f5',
        'text-default': '#1f2937',
        'border-default': '#e5e7eb',
      },
    },
  },
  plugins: [],
}
