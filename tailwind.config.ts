import type { Config } from 'tailwindcss'
import scrollbarHide from 'tailwind-scrollbar-hide'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbarHide,
  ],
}

export default config
