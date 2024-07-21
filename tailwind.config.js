/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        topHeader: '#3d5c5c',
        sidePanel: '#669999',
        sidePanelLink: '#3d5c5c',
        navButton: '#000000'
      },
    },
  },
  plugins: [],
}

