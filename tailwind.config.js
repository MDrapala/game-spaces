/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "space-dark": "#0A0E1A",
        "space-blue": "#131B2F",
        "space-light-blue": "#2A3A5C",
        "space-accent": "#4682B4",
        "space-highlight": "#1E90FF",
        "space-gold": "#FFD700",
        "space-energy": "#7CFC00",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        "shooting-star": "shooting-star 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shooting-star": {
          "0%": { transform: "translateX(0) translateY(0)", opacity: 1 },
          "100%": {
            transform: "translateX(100px) translateY(100px)",
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
};
