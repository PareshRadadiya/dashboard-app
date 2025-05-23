/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1976d2",
          light: "#64b5f6",
          dark: "#1565c0",
        },
      },
    },
  },
  plugins: [],
};
