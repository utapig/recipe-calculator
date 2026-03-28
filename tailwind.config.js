/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    // Keep existing app styles stable. Enable if you want Tailwind reset.
    preflight: false,
  },
  plugins: [],
};
