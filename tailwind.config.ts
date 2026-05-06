import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1B2C",
          900: "#0E1B2C",
          800: "#172335",
          700: "#1F2C40",
        },
        paper: "#F4F5F7",
        tick: "#10B981",
        accent: "#3B82F6",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          '"General Sans"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,27,44,0.04), 0 8px 24px rgba(14,27,44,0.06)",
        ring: "0 0 0 4px rgba(16,185,129,0.18)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(14,27,44,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,27,44,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
