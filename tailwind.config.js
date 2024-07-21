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
        cell2: '#f5f5f0',
        cell4: '#e0e0d1',
        cell8: '#ccccb3',
        cell16: '#b8b894',
        cell32: '#a3a375',
        cell64: '#8a8a5c',
        cell128: '#6b6b47',
        cell256: '#4d4d33',
        cell512: '#3d3d29',
        cell1024: '#2e2e1f',
        cell2048: '#5c8a8a',
        cell4096: '#527a7a',
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

