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
        'base': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'lg': ['1.25rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['4.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '7xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '9xl': ['8.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        // Extra large sizes for better readability
        '10xl': ['10rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '11xl': ['12rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      colors: {
        // Enhanced minimalist, modern palette
        background: '#0d1117', // main dark bg
        surface: '#161b22',    // card bg
        surfaceLight: '#1f2937', // lighter surface
        border: '#22262c',     // subtle border
        borderLight: '#374151', // lighter border
        accent: '#3b82f6',     // blue accent
        accentLight: '#60a5fa',
        accentDark: '#2563eb',
        accentHover: '#1d4ed8',
        text: '#e5e7eb',       // main text
        textSecondary: '#94a3b8', // secondary text
        textMuted: '#6b7280',  // muted text
        white: '#fff',
        black: '#000',
        // Success/Error states
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        // Gradient colors
        gradient: {
          primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          secondary: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          dark: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        card: '1.25rem',
        button: '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        card: '0 4px 32px 0 rgba(31, 38, 135, 0.12)',
        cardHover: '0 8px 48px 0 rgba(31, 38, 135, 0.16)',
        accent: '0 0 0 2px #3b82f6',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      },
      animation: {
        'float-normal': 'float 6s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { textShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6' },
          'to': { textShadow: '0 0 20px #3b82f6, 0 0 30px #3b82f6' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};