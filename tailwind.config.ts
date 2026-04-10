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
        // Dödsbo brand palette — grief-aware, soft, trustworthy
        primary: {
          DEFAULT: '#1A3C5E',
          light: '#2E75B6',
          lighter: '#D5E8F0',
        },
        accent: '#2E75B6',
        warn: '#C0392B',
        success: '#27AE60',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        muted: '#6B7280',
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
