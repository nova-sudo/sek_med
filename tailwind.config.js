/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        aqem: ['aqem'],
        flore: ['flore'],
        monogram: ['monogram'],
        darling:['darling'],
        pixel: ['Pixel'],
        wild:['Wildly'],
        coffee:['coffee'],
        cool:['cool'],
        lostar:['Lostar'],
        mine:['mine'],
      },
      fontSize:{
        header:'15em'
      }
    },
  },
  plugins: [],
}