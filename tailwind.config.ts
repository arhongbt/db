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
          dark: '#4F6145',
          light: '#8FA882',
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
