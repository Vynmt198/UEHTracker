/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ueh: {
          primary: '#49C8D6',
          'primary-dark': '#29B3C2',
          'primary-light': '#E8FAFC',
          'primary-hover': '#3BB8C6',
          navy: '#004B87',
          'navy-dark': '#003366',
          accent: '#FF7A00',
          'accent-light': '#FFF4EB',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 30px -5px rgba(73, 200, 214, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
