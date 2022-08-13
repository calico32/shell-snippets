const { Colors } = require('@blueprintjs/core')

const names = new Set(Object.keys(Colors).map((key) => key.replace(/\d$/g, '')))

names.delete('BLACK')
names.delete('WHITE')

/** @type {{ black: string, white: string, [key: string]: { [key in 1|2|3|4|5]: string } }} */
const blueprintColors = {
  black: Colors.BLACK,
  white: Colors.WHITE,
}

names.forEach((name) => {
  const o = {}
  for (let i = 1; i <= 5; i++) {
    const key = `${name}${i}`
    o[i] = Colors[key]
  }
  blueprintColors[name.toLowerCase().replaceAll('_', '')] = o
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.tsx', './pages/**/*.tsx', './styles/**/*.scss'],
  darkMode: 'class',
  theme: {
    colors: {
      ...blueprintColors,
      transparent: 'transparent',
      current: 'currentColor',
      intent: {
        primary: blueprintColors.blue[5],
        success: blueprintColors.green[3],
        warning: blueprintColors.orange[3],
        danger: blueprintColors.red[3],
      },
    },
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif'],
        mono: ['monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
