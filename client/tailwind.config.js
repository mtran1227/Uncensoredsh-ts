/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // 👈 tell Tailwind to look inside your React project
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        propaganda: ['Propaganda', 'sans-serif'],
      },
      colors: {
        'bg-secondary': '#f4f4f5',
        'text-default': '#1f2937',
        'border-default': '#e5e7eb',
      },
    },
  },
  plugins: [],
}
