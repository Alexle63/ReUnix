/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}"],
  theme: {
    extend: {
        fontFamily: {
            'terminal': ['"Lucida Console"', 'monospace']
        },
        colors: {
            'grn': '#39ff14',
        },
    },
    
  },
  plugins: [],
}

