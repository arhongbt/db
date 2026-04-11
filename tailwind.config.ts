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
        // Sista Resan — "Soft Structure" palette
        primary: {
          DEFAULT: '#2A2622',   // warm charcoal
          light: '#4A4540',     // warm slate
          lighter: '#F0EDE6',   // warm sand
        },
        accent: {
          DEFAULT: '#6B7F5E',   // sage green
          dark: '#4F6145',      // sage dark
          light: '#8FA882',     // sage light
        },
        info: {
          DEFAULT: '#6E8BA4',   // dusty blue
          dark: '#567A93',
          light: '#EDF2F6',     // dusty blue tint
        },
        warn: '#C4704B',        // terracotta (bara varningar)
        success: '#6B7F5E',     // sage = success
        background: '#F7F5F0',  // warm linen
        surface: '#FFFFFF',
        muted: '#6B6560',       // warm gray
        'muted-light': '#9C9590',
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
        'card': '1.5rem',    // 24px — mjukare, mer organiskt
        'card-sm': '0.875rem', // 14px
      },
    },
  },
  plugins: [],
};

export default config;
