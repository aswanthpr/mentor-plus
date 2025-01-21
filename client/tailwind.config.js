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
    // function ({ addComponents }) {
    //   // Custom Media Query for screens between 320px to 480px
    //   addComponents({
    //     '@media (min-width: 320px) and (max-width: 480px)': {
    //       'xss': {
    //         fontSize: '14px',  
    //         lineHeight: '1.5',
    //         padding: '10px',
    //       },
    //     },
    //   });
    // },
  ],
}

