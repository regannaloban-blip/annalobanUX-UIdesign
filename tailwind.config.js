/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        buffon: ["Buffon", "Inter", "Arial", "sans-serif"],
        display: ["Inter", "Arial", "sans-serif"],
        mono: ['"IBM Plex Mono"', '"Courier New"', "monospace"],
        jakarta: ['"Plus Jakarta Sans"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
