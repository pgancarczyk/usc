import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      primary: "hsl(240, 57%, 63%)",
      "primary-light": "hsl(240 57% 94% / 1)",
      white: "#eee",
    },
  },
  plugins: [],
} satisfies Config;
