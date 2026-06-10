/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#F9FAFB",
        accent: {
          light: "#F3E5AB", // Beige
          DEFAULT: "#D4AF37", // Gold
          dark: "#B8860B", // Darker gold
        },
        text: {
          main: "#111827", // Dark gray (almost black) for contrast
          muted: "#6B7280", // Gray for subtitles
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
