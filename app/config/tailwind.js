const colors = require("tailwindcss/colors");
const { colors: myColors } = require("./colors");

module.exports = {
  mode: "jit", // this will enable Tailwind JIT compiler to make the build faster
  purge: [
    "./app/**/*.{ts,tsx}",
    "./node_modules/@vechaiui/**/*.{js,ts,jsx,tsx}",
  ], // Here we are going to tell Tailwind to use any .ts or .tsx file to purge the CSS
  darkMode: "media", // Use media queries for dark mode, customize it as you want
  variants: {}, // activate any variant you want here
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@vechaiui/core")({
      colors: ["success", "error"],
    }),
    require("@tailwindcss/typography"),
  ], // add any plugin you need here
  theme: {
    // colors: {
    //   ...colors,
    //   ...myColors,
    // },
    extend: {
      colors: myColors,
    },
  }, // customize the theme however you want here
};
