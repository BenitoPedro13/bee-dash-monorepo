/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
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
        'nexa': ['var(--font-nexa)'],
        'nexa-bold': ['var(--font-nexa-bold)'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}