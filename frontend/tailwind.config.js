/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tt: {
          deep: "#062F6E",
          blue: "#0B4E9B",
          cyan: "#29ABE2",
          teal: "#00A99D",
          green: "#3AAA35",
          lime: "#8DC63F",
          yellow: "#FFD100",
          orange: "#F7941E",
          red: "#F15A22",
          magenta: "#E6007E",
          purple: "#92278F",
          violet: "#662D91",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
