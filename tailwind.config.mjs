/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f9d2d8',
          300: '#f4adb8',
          400: '#ec7d8f',
          500: '#e04d67',
          600: '#cc2d4d',
          700: '#ab223f',
          800: '#8e2038',
          900: '#771e34',
          950: '#410c19',
        },
      },
      fontFamily: {
        monaco: ['Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};