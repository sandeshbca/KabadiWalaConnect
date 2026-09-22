import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#075f49",
        mint: "#dff8ea",
        ink: "#11261f",
        lime: "#c7f76a",
      },
      boxShadow: { card: "0 22px 60px rgba(8, 50, 37, .12)" },
    },
  },
  plugins: [],
} satisfies Config;
