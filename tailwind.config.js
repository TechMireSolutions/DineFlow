/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chalk: "#FDFDFD",
        mint: {
          50: "#F3FBF7",
          100: "#E6F5EE",
          200: "#CDEBD8",
          300: "#A6D9BC",
          400: "#7EC7A1",
          500: "#5BAE82",
          600: "#478A67",
          700: "#35674D"
        },
        ink: "#1F2937"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.08)",
        float: "0 24px 80px rgba(91, 174, 130, 0.16)"
      },
      borderRadius: {
        antigravity: "32px"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top left, rgba(91, 174, 130, 0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.05), transparent 28%)"
      }
    }
  },
  plugins: []
};
