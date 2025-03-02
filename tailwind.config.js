/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./views/**/*.ejs",         // Scan all EJS templates in your views folder
      "./assets/**/*.{html,js,css}" // Also scan any HTML/JS/CSS files in assets
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  