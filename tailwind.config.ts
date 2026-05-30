import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        hindi: ["var(--font-hindi)", "sans-serif"],
      },
      colors: {
        saffron: {
          50: "#fff8f0",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        cream: {
          50: "#fdfaf5",
          100: "#faf3e7",
          200: "#f5e6c8",
          300: "#efd3a0",
          400: "#e5b96b",
          500: "#d4964a",
        },
        spice: {
          turmeric: "#E8A830",
          chili: "#C1440E",
          cardamom: "#4A7C59",
          cinnamon: "#8B4513",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, #f97316 0px, transparent 50%), radial-gradient(at 80% 0%, #ea580c 0px, transparent 50%), radial-gradient(at 0% 50%, #fed7aa 0px, transparent 50%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        "float-fast": "float 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-15px) rotate(3deg)" },
          "66%": { transform: "translateY(-8px) rotate(-2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(249,115,22,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(249,115,22,0.7)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
