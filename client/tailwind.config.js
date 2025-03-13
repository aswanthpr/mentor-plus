/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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

