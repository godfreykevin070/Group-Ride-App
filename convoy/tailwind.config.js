/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lime: "#D4FF3A",
        emerald: "#00D68F",
        cyan: "#00E5FF",
        purple: "#8B5CF6",
        orange: "#FF6B35",
        cardYellow: "#FFD60A",
        cardBlue: "#4A6CF7",
        ink: "#050608",
        surface: "#0C0E12",
        surface2: "#161A21",
      },
      borderRadius: {
        exp: "28px",
        expSm: "20px",
        expXs: "14px",
      },
    },
  },
  plugins: [],
};