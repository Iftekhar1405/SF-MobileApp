/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#E8193C",
        "primary-dark": "#C0143A",
        success: "#2E7D32",
        warning: "#FF6F00",
        error: "#B00020",
        "off-white": "#F5F5F5",
        "light-gray": "#EEEEEE",
        "medium-gray": "#9E9E9E",
        "dark-gray": "#212121",
      }
    },
  },
  plugins: [],
}
