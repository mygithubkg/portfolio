/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0.01em' }], // Increased line height for readability
        'lg': ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.01em' }],
        'xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.02em' }], // Tighter tracking for headings
        '2xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '3xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.03em' }],
        '4xl': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '5xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['4.25rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '8xl': ['6.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '9xl': ['8.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      colors: {
        // Premium Soft Minimalist Palette
        background: '#09090b', // Zinc 950
        surface: '#18181b',    // Zinc 900
        surfaceLight: '#27272a', // Zinc 800
        border: '#27272a',     // Zinc 800
        borderLight: '#3f3f46', // Zinc 700
        accent: '#6366f1',     // Soft Indigo (Muted, sophisticated)
        accentLight: '#818cf8', // Indigo 400
        accentDark: '#4f46e5',  // Indigo 600
        text: '#fafafa',       // Zinc 50
        textSecondary: '#a1a1aa', // Zinc 400
        textMuted: '#71717a',  // Zinc 500
        white: '#ffffff',
        black: '#000000',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        card: '1rem',
        button: '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Premium soft shadows replacing neon glows
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        // Subtle, gentle animations
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 1s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' }, // Reduced from 30px
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};