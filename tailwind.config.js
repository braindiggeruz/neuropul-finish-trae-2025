/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Neuropul Design System Tokens
      colors: {
        // Primary brand colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        // Secondary brand colors
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        
        // Accent colors
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        
        // Neuropul specific colors
        neuropul: {
          bg: '#0a0a0a',
          surface: '#141414',
          surfaceLight: '#1a1a1a',
          border: '#2a2a2a',
          text: '#ffffff',
          textSecondary: '#a0a0a0',
          textMuted: '#666666',
          cyber: '#00ffff',
          matrix: '#00ff00',
          danger: '#ff0040',
          warning: '#ff9500',
          success: '#00ff88',
        },
        
        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      
      // Spacing based on 8px grid
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        cyber: ['Share Tech Mono', 'monospace'],
      },
      
      // Font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        'cyber': '0.125rem',
        'neuropul': '0.25rem',
      },
      
      // Shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        
        // Neuropul specific shadows
        'cyber': '0 0 20px rgba(0, 255, 255, 0.5)',
        'cyber-lg': '0 0 40px rgba(0, 255, 255, 0.7)',
        'matrix': '0 0 20px rgba(0, 255, 0, 0.5)',
        'neuropul': '0 0 30px rgba(139, 92, 246, 0.3)',
        'neuropul-lg': '0 0 60px rgba(139, 92, 246, 0.5)',
        'glow': '0 0 10px rgba(139, 92, 246, 0.8)',
        'glow-lg': '0 0 20px rgba(139, 92, 246, 1)',
      },
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-cyber': 'pulseCyber 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'matrix': 'matrix 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'typewriter': 'typewriter 2s steps(40) forwards',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        pulseCyber: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            borderColor: 'rgba(0, 255, 255, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.8)',
            borderColor: 'rgba(0, 255, 255, 0.8)',
          },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 1)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      
      // Backdrop filters
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // Z-index scale
      zIndex: {
        'hide': -1,
        'auto': 'auto',
        'base': 0,
        'docked': 10,
        'dropdown': 1000,
        'sticky': 1100,
        'banner': 1200,
        'overlay': 1300,
        'modal': 1400,
        'popover': 1500,
        'skipLink': 1600,
        'toast': 1700,
        'tooltip': 1800,
        'neuropul': 9999,
      },
      
      // Aspect ratio
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '16/9': '16 / 9',
        '2/1': '2 / 1',
        '1/1': '1 / 1',
        '9/16': '9 / 16',
      },
      
      // Grid templates
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      
      // Max width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // Min height
      minHeight: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [
    // Forms plugin for better form styling
    require('@tailwindcss/forms'),
    
    // Typography plugin for better text styling
    require('@tailwindcss/typography'),
    
    // Container queries plugin
    require('@tailwindcss/container-queries'),
    
    // Custom plugin for Neuropul specific styles
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.text-shadow-cyber': {
          textShadow: '0 0 10px currentColor',
        },
        '.text-shadow-glow': {
          textShadow: '0 0 20px currentColor',
        },
        '.backdrop-blur-neuropul': {
          backdropFilter: 'blur(8px) saturate(1.8)',
        },
        '.glass': {
          backgroundColor: 'rgba(20, 20, 20, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-cyber': {
          backgroundColor: 'rgba(0, 20, 20, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
        },
      });
      
      // Custom components
      addComponents({
        '.btn-cyber': {
          backgroundColor: 'transparent',
          border: `1px solid ${theme('colors.neuropul.cyber')}`,
          color: theme('colors.neuropul.cyber'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.cyber'),
          boxShadow: theme('boxShadow.cyber'),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.cyber-lg'),
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-neuropul': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.neuropul'),
          boxShadow: theme('boxShadow.neuropul'),
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme('colors.primary.700'),
            boxShadow: theme('boxShadow.neuropul-lg'),
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.card-neuropul': {
          backgroundColor: theme('colors.neuropul.surface'),
          border: `1px solid ${theme('colors.neuropul.border')}`,
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.lg'),
          padding: theme('spacing.6'),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.neuropul'),
            borderColor: theme('colors.neuropul.cyber'),
          },
        },
        '.input-cyber': {
          backgroundColor: 'transparent',
          border: `1px solid ${theme('colors.neuropul.border')}`,
          color: theme('colors.neuropul.text'),
          borderRadius: theme('borderRadius.cyber'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          boxShadow: `inset 0 0 10px rgba(0, 0, 0, 0.3)`,
          transition: 'all 0.3s ease',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.neuropul.cyber'),
            boxShadow: `inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 10px ${theme('colors.neuropul.cyber')}`,
          },
        },
      });
    },
  ],
}
