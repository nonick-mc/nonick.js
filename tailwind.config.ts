import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: '#121212',
          },
        },
      },
    }),
  ],
} satisfies Config;
