import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: 'rgba(255, 208, 0, 0.08)',
          focus: '#FFD000',
          error: '#EF4444',
        },
        background: {
          DEFAULT: '#000B30',
          surface: '#0A1640',
          lift: '#0E1E54',
        },
        primary: {
          DEFAULT: '#FFD000',
          dim: '#C9960A',
          foreground: '#000B30',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
          muted: '#6B7280',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#22C55E',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.15)',
        lift: '0 8px 24px rgba(0, 0, 0, 0.25)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms ease-out',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
