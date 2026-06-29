/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
        },
        surface: {
          page: '#FFFFFF',
          card: '#FFFFFF',
          input: '#FFFFFF',
          border: '#D1FAE5',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(28, 43, 36, 0.06)',
        'card-hover': '0 8px 32px rgba(28, 43, 36, 0.1)',
      },
    },
  },
  plugins: [],
}

