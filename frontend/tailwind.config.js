/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F8FC',
          100: '#E5EEF9',
          200: '#C7DBF2',
          300: '#9EC0E7',
          400: '#6F9ED8', // Soft Government Blue
          500: '#3E77C2',
          600: '#2456A6', // Royal Institutional Blue
          700: '#173B72', // Deep Government Blue
          800: '#112C57',
          900: '#0C2040',
          950: '#071328',
        },
        gov: {
          deep: '#173B72',   // Deep Government Blue
          royal: '#2456A6',  // Royal Institutional Blue
          soft: '#6F9ED8',   // Soft Government Blue
          white: '#FFFFFF',  // Clean White
          bg: '#F5F7FA',     // Soft Background
          cream: '#F3E8D0',  // Warm Architectural Cream
          sand: '#D8C39A',   // Heritage Sand
          dark: '#172033',   // Dark Text
          muted: '#5E6B7D',  // Muted Text
          gold: '#C89B3C',   // Subtle Golden
          green: '#1B8354',  // Professional Success
          amber: '#B7791F',  // Professional Warning
          red: '#C53030',    // Professional Danger
          border: '#E2E8F0', // Government Border
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(23, 59, 114, 0.08), 0 1px 2px 0 rgba(23, 59, 114, 0.04)',
        'gov-md': '0 4px 6px -1px rgba(23, 59, 114, 0.1), 0 2px 4px -1px rgba(23, 59, 114, 0.06)',
        'gov-lg': '0 10px 15px -3px rgba(23, 59, 114, 0.12), 0 4px 6px -2px rgba(23, 59, 114, 0.05)',
      }
    },
  },
  plugins: [],
}
