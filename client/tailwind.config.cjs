/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.stories.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#E8F5E8',
          100: '#D1EBD1',
          200: '#A3D7A3',
          300: '#75C375',
          400: '#47AF47',
          500: '#00C853',
          600: '#00A043',
          700: '#007833',
          800: '#005024',
          900: '#002815',
        },
        accent: {
          50: '#FFF8E1',
          100: '#FFF1C4',
          200: '#FFE388',
          300: '#FFD54F',
          400: '#FFC107',
          500: '#FFAB00',
          600: '#CC8800',
          700: '#996600',
          800: '#664400',
          900: '#332200',
        },
      },
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
