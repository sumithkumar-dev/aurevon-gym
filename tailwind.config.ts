import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        "surface-raised": "hsl(var(--surface-raised))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          dim: "hsl(var(--accent-dim))",
          bright: "hsl(var(--accent-bright))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          strong: "hsl(var(--destructive-strong))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-1": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        content: "1440px",
      },
      spacing: {
        "section": "clamp(5rem, 12vw, 10rem)",
        "18": "4.5rem",
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.8s ease forwards",
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
