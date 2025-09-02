/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        sidebar: "var(--sidebar)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        heading: ["var(--font-merriweather-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-light":
          "linear-gradient(45deg, var(--primary) 0%, var(--accent) 15%, var(--secondary) 30%, var(--accent) 45%, var(--primary) 60%, var(--secondary) 75%, var(--accent) 90%, var(--primary) 100%)",
        "gradient-dark":
          "linear-gradient(45deg, var(--primary) 0%, var(--accent) 15%, var(--secondary) 30%, var(--accent) 45%, var(--primary) 60%, var(--secondary) 75%, var(--accent) 90%, var(--primary) 100%)",
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite",

        // loader animations
        pathTriangle:
          "pathTriangle 3s cubic-bezier(0.785,0.135,0.15,0.86) infinite",
        dotTriangle:
          "dotTriangle 3s cubic-bezier(0.785,0.135,0.15,0.86) infinite",
        pathRect: "pathRect 3s cubic-bezier(0.785,0.135,0.15,0.86) infinite",
        dotRect: "dotRect 3s cubic-bezier(0.785,0.135,0.15,0.86) infinite",
        pathCircle:
          "pathCircle 3s cubic-bezier(0.785,0.135,0.15,0.86) infinite",
      },
      keyframes: {
        aurora: {
          "0%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(0deg) scale(1)",
          },
          "25%": {
            backgroundPosition: "100% 50%",
            transform: "rotate(90deg) scale(1.1)",
          },
          "50%": {
            backgroundPosition: "100% 100%",
            transform: "rotate(180deg) scale(0.9)",
          },
          "75%": {
            backgroundPosition: "0% 100%",
            transform: "rotate(270deg) scale(1.1)",
          },
          "100%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(360deg) scale(1)",
          },
        },

        // loader keyframes
        pathTriangle: {
          "0%": { strokeDashoffset: "221" },
          "33%": { strokeDashoffset: "147" },
          "66%": { strokeDashoffset: "74" },
          "100%": { strokeDashoffset: "0" },
        },
        dotTriangle: {
          "0%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(10px, -18px)" },
          "66%": { transform: "translate(-10px, -18px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        pathRect: {
          "0%": { strokeDashoffset: "256" },
          "25%": { strokeDashoffset: "192" },
          "50%": { strokeDashoffset: "128" },
          "75%": { strokeDashoffset: "64" },
          "100%": { strokeDashoffset: "0" },
        },
        dotRect: {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(18px, -18px)" },
          "50%": { transform: "translate(0, -36px)" },
          "75%": { transform: "translate(-18px, -18px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        pathCircle: {
          "0%": { strokeDashoffset: "201" },
          "25%": { strokeDashoffset: "151" },
          "50%": { strokeDashoffset: "101" },
          "75%": { strokeDashoffset: "51" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
