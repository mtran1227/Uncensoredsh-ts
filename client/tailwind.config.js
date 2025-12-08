/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        propaganda: ['Propaganda', 'sans-serif'],
        vanguard: ['Vanguard CF', 'sans-serif'],
        uncensored: ['Boldonse', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'blue-uncensored': '#004DFF',
      },
    },
  },
  plugins: [],
}