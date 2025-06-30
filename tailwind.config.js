/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // If using Next.js App Router
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F8F8F8',
        'dark-gray': '#333333',
        'medium-gray': '#A0A0A0',
        'classic-red': '#A93226',
        'red-700': '#922B21', // Darker shade for hover
      },
      fontFamily: {
        // Using Tailwind's defaults is fine, but you can customize like so:
        // sans: ['Inter', 'sans-serif'],
        // serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
