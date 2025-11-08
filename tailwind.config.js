/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Libre Baskerville", "serif"],
        title: ["Cinzel Decorative", "serif"],
      },
      colors: {
        light: {
          bg: "#f9f3e7",
          paper: "#f0e6d2",
          text: "#2a1c0f",
          accent: "#8b0000",
        },
        dark: {
          bg: "#0a0a0a",
          paper: "#1b0d0d",
          text: "#f5e6cc",
          accent: "#b00000",
        },
        blood: "#8b0000",
        fog: "#d8c7a4",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 80, 80, 0.4)",
        innerFog: "inset 0 0 50px rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "radial-fog":
          "radial-gradient(circle at 50% 30%, rgba(27,13,13,1), rgba(10,10,10,1))",
        "radial-parchment":
          "radial-gradient(circle at 30% 20%, #f9f3e7, #f0e6d2)",
      },
      transitionDuration: {
        fast: "200ms",
        slow: "800ms",
      },
    },
  },
  plugins: [],
};