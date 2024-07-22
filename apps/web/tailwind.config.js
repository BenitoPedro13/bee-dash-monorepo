/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xl': '1440px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        'metric': 'repeat(2, minmax(129px, 1fr))',
      },
      boxShadow: {
        'metrics': '2px 2px 2px 0px rgba(16, 24, 40, 0.06);',
        'metrics-hover': '2px 2px 0px 0px #000000;',
        'cost-per-metrics': '0px 1px 2px 0px rgba(16, 24, 40, 0.05);',
        'financial-metrics': '0px 1px 2px 0px rgba(0, 0, 0, 0.25);',
        'contact-cta': '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10000000149011612);'
      },
      fontFamily: {
        'Balgin': 'Balgin',
        'Balgin-Text': 'Balgin Regular',
        'Balgin-Expanded': 'Balgin Expanded',
        'Balgin-Display': 'Balgin Text Bold',
        'Inter': '__Inter_0ec1f4',
      }
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
