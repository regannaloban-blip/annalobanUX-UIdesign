/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "Arial", "sans-serif"],
        mono: ['"IBM Plex Mono"', '"Courier New"', "monospace"],
        jakarta: ['"Plus Jakarta Sans"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
