import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1e3a8a',
        'secondary-blue': '#3b82f6',
        'pale-green': '#dcfce7',
        'lime-green': '#84cc16',
        'navy-blue': '#0f172a',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      resize: {
        'none': 'none',
        'y': 'vertical',
        'x': 'horizontal',
        'both': 'both',
      },
    },
  },
  plugins: [],
};

export default config; 