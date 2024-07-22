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
        navButton: '#000000',
        cell2: '#c2c2d6',
        cell4: '#9494b8',
        cell8: '#666699',
        cell16: '#c2d6d6',
        cell32: '#94b8b8',
        cell64: '#669999',
        cell128: '#476b6b',
        cell256: '#b8b894',
        cell512: '#999966',
        cell1024: '#ffff99',
        cell2048: '#ffff66',
        cell4096: '#ffff00',
      },
      userSelect: {
        'none': 'none',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

