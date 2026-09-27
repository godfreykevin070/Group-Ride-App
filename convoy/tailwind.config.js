/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E15",
        surface: "#151A23",
        "surface-2": "#1D242F",
        "surface-3": "#252E3C",
        primary: "#FF7B6B",
        "primary-deep": "#E55A48",
        mint: "#7CE5B0",
        amber: "#FFB454",
        sky: "#6DD5ED",
        purple: "#B79FFF",
        rose: "#FF5C7A",
      },
      borderRadius: {
        xl: "26px",
        lg: "20px",
        md: "14px",
      },
    },
  },
  plugins: [],
};