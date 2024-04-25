import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      primary: "#6a6ad6",
      "primary-light": "hsl(240 57% 94% / 1)",
      white: "#eee",
    },
  },
  plugins: [],
} satisfies Config;
