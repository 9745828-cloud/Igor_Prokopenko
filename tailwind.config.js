/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "navy-deep": "#0A1628",
        "navy": "#0F1C2E",
        "gold": "#C5A26F",
        "gold-light": "#D9BD8D",
        "ink": "#E8E6DD",
        "muted": "#B8C2D1"
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
