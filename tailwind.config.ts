import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|button|card|chip|divider|dropdown|link|listbox|modal|navbar|scroll-shadow|select|skeleton|user|ripple|spinner|menu|popover).js"
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
