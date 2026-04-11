import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sista Resan — Lugn & Hopp palette
        primary: {
          DEFAULT: '#2C4A6E',
          light: '#3D6B99',
          lighter: '#D8E6ED',
        },
        accent: {
          DEFAULT: '#7A9E8E',
          dark: '#5F8474',
        },
        warn: '#C0392B',
        success: '#5F8474',
        background: '#F7F9F8',
        surface: '#FFFFFF',
        muted: '#6B7B75',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // WCAG 2.1 AA — 16pt minimum body text
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
      },
      spacing: {
        // 48px touch targets (WCAG)
        'touch': '3rem',
      },
      borderRadius: {
        'card': '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
