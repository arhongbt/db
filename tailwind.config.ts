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
        // Uses CSS variables so dark mode works automatically
        primary: {
          DEFAULT: 'var(--text)',
          light: 'var(--text-secondary)',
          lighter: 'var(--border-light)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dark: '#5A6E4E',
          light: '#8FAA82',
        },
        info: {
          DEFAULT: '#6E8BA4',
          dark: '#567A93',
          light: 'var(--accent-soft)',
        },
        warn: '#C4704B',
        success: 'var(--accent)',
        background: 'var(--bg)',
        surface: 'var(--bg-card)',
        muted: 'var(--text-secondary)',
        'muted-light': 'var(--text-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        // WCAG 2.1 AA — 16pt minimum body text
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.65' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.625rem', { lineHeight: '1.35' }],
        '3xl': ['2.125rem', { lineHeight: '1.2' }],
        '4xl': ['2.75rem', { lineHeight: '1.1' }],
      },
      spacing: {
        // 48px touch targets (WCAG)
        'touch': '3rem',
      },
      borderRadius: {
        'card': '1.75rem',    // 28px — Tiimo bubbly
        'card-sm': '1.125rem', // 18px
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
