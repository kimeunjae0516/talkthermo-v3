import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b1020",
        foreground: "#ecf1ff",
        card: "#111935",
        accent: "#8b9cfb"
      }
    }
  },
  plugins: []
};

export default config;
