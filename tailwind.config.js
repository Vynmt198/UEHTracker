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
          navy: '#0B2545',
          'navy-light': '#132E59',
          'navy-dark': '#061830',
          forest: '#49C8D6',
          'forest-hover': '#3BB8C6',
          'forest-light': '#E8FAFC',
          gold: '#F2A900',
          'gold-light': '#FEF3D6',
          'gold-hover': '#D99800',
          accent: '#FF7A00',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 20px -2px rgba(11, 37, 69, 0.06), 0 2px 6px -1px rgba(11, 37, 69, 0.03)',
        'card': '0 12px 32px -4px rgba(73, 200, 214, 0.12), 0 4px 12px -2px rgba(11, 37, 69, 0.04)',
        'floating': '0 20px 40px -10px rgba(11, 37, 69, 0.12), 0 8px 16px -4px rgba(11, 37, 69, 0.06)',
        'gold-glow': '0 0 20px -3px rgba(242, 169, 0, 0.35)',
        'cyan-glow': '0 0 20px -3px rgba(73, 200, 214, 0.4)',
      }
    },
  },
  plugins: [],
}
