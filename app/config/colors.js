const Color = require("color");

const colors = {
  primary: {
    50: "#fffdfa",
    100: "#fefbf5",
    200: "#fcebca",
    300: "#f9d895",
    400: "#f6c056",
    500: "#eda20d",
    600: "#da950c",
    700: "#c1840b",
    800: "#a06d09",
    900: "#795307",
  },
  secondary: {
    50: "#fffefa",
    100: "#fefcf1",
    200: "#fbf4c6",
    300: "#f8ea91",
    400: "#f4df57",
    500: "#f0d314",
    600: "#d8bd0e",
    700: "#bba30c",
    800: "#99860a",
    900: "#655807",
  },
  tertiary: {
    50: "#fafdff",
    100: "#fafdff",
    200: "#d4effc",
    300: "#aee0f9",
    400: "#83d0f6",
    500: "#45b8f2",
    600: "#16a6ee",
    700: "#0f94d6",
    800: "#0d7db5",
    900: "#0a5f8a",
  },
  danger: {
    50: "#fffcfa",
    100: "#fffcfa",
    200: "#ffe1cc",
    300: "#ffc194",
    400: "#ff9a52",
    500: "#eb6200",
    600: "#db5b00",
    700: "#cc5500",
    800: "#ad4800",
    900: "#943e00",
  },
  error: {
    50: "#fffcfa",
    100: "#fffcfa",
    200: "#ffe1cc",
    300: "#ffc194",
    400: "#ff9a52",
    500: "#eb6200",
    600: "#db5b00",
    700: "#cc5500",
    800: "#ad4800",
    900: "#943e00",
  },
  success: {
    DEFAULT: "#0DBA66",
    50: "#88F7C1",
    100: "#75F5B7",
    200: "#4FF3A3",
    300: "#29F08F",
    400: "#10E07B",
    500: "#0DBA66",
    600: "#098649",
    700: "#06512C",
    800: "#021D10",
    900: "#000000",
  },
};

const overlayBackgroundColor = new Color(colors.primary[200])
  .fade(0.05)
  .rgb()
  .string();

module.exports = {
  colors,
  overlayBackgroundColor,
};
