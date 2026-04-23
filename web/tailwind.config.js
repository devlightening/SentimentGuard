/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#1e2530",
        panel: "#252d3a",
        border: "#2e3848",
      },
    },
  },
  plugins: [],
};
