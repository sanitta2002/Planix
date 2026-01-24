import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",

        card: "hsl(var(--card, var(--background)) / <alpha-value>)",
        secondary: "hsl(var(--secondary, var(--background)) / <alpha-value>)",

        muted: "hsl(var(--muted, var(--foreground)) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground, var(--foreground)) / <alpha-value>)",

        primary: "hsl(var(--primary, 217 91% 60%) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground, 0 0% 100%) / <alpha-value>)",

        accent: "hsl(var(--accent, 280 70% 60%) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground, 0 0% 100%) / <alpha-value>)",

        destructive: "hsl(var(--destructive, 0 84% 60%) / <alpha-value>)",
      },
    },
  },
  plugins: [],
} satisfies Config;
