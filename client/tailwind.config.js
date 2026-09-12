/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0B0B0D",
          light: "#141417",
          surface: "#18181C",
          border: "#26262B",
        },
        gold: {
          50: "#FDF6E3",
          100: "#FAEAB8",
          200: "#F5D77B",
          300: "#F0C651",
          400: "#E8A93E",
          500: "#D9A02E",
          600: "#B9821F",
          700: "#8F6317",
        },
        ivory: "#F5F3EE",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
        accent: ["'Poppins'", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5D77B 0%, #E8A93E 45%, #B9821F 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(232,169,62,0.14), transparent 60%)",
      },
      boxShadow: {
        gold: "0 8px 30px -8px rgba(232, 169, 62, 0.45)",
        "gold-sm": "0 4px 14px -4px rgba(232, 169, 62, 0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
