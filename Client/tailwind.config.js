/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#346164",
        secondaryDarkGray: "#999898",
        secondaryGray: "#F5F5F5",
      },
      fontFamily: {
        sans: ["Sarabun", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors:{
        primary:"#346164",
        secondaryDarkGray:"#999898",
        secondaryGray:"#F5F5F5",
      },
      backgroundImage: {
        'account-image-bg': "url('/CreateAccount/bgTexture2.svg')",
      },
      screens:{
        '3xl': '2000px',
        '4xl': '2500px',
        'tall': { 'raw': '(min-height: 800px)' },
      }
    },
  },
  plugins: [],
}

