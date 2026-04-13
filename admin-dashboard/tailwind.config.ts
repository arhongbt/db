import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ed",
          100: "#dce5d5",
          200: "#b9cbab",
          300: "#96b181",
          400: "#7a9c63",
          500: "#6B7F5E",
          600: "#566649",
          700: "#414d37",
          800: "#2b3325",
          900: "#161a12",
        },
        surface: "#F7F5F0",
      },
    },
  },
  plugins: [],
};
export default config;
