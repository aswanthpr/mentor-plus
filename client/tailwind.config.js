/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      screens: {
        'xs': '480px', 
        'xss':'320px'
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'ftxs': '0.625rem',
      },
      fontFamily:{
      sans:['Poppins','sans-serif'],
      }
    },
  },
  plugins: [

  ],
}

