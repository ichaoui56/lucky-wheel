import type { Config } from "tailwindcss"

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F1ED",
        beige: "#E8DFD5",
        "beige-dark": "#D9CCBE",
        gold: "#D4AF96",
        "gold-dark": "#B8956D",
        black: "#1A1A1A",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
