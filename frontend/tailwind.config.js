/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontSize: {
        base: '12px',
        title: '16px',
        subheader: '18px',
        header: '20px',

        body1: '14px',
        body2: '12px',
        h6: '14px',
        h5: '16px',
        h4: '20px',
        h3: '24px',
        h2: '32px',
        h1: '40px',
        subtitle1: '12px',
        subtitle2: '10px',
      },
    },
    colors: {
      black: '#222831',
      grey: {
        100: '#FAFAFA',
        200: '#EEEEEE',
        300: '#DDDDDD',
        400: '#C5C5C5',
        500: '#85858A'
      },
      white: '#EEEEEE',

      primary: '#FFD369',
      lightPrimary: '#ffe8b3',
      darkPrimary: '#e6a100',

      danger: '#E01B00',
      darkDanger: '#BE1700',
      lightDanger: '#FCE8E5',

      success: '#009D4F',
      lightSuccess: '#E5F5ED',
      darkSuccess: '',

      warning: '#FFB600',
      lightWarning: '#FFF8E5',
      darkWarning: ''

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
    }
  },
  plugins: [],
}
