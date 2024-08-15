/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./public/index.html",
  ],
  theme: {
    colors: {
      black: '#222831',
      grey: '#393E46',
      yellow: '#FFD369',
      white: '#EEEEEE',
    },
    fontSize: {
      base: '12px',
      title: '16px',
      subheader: '18px',
      header: '20px',
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '1': '1px',
      '2': '2px'
    },
    extend: {
      borderOpacity: {
        '10': '10%',
        '50': '50%',
      },
    },
  },
  plugins: [],
}
