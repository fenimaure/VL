/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Monochrome Palette
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712', // Deep Black
        },
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        accent: {
          50: '#ffffff',
          100: '#efefef',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#383838',
          900: '#1e1e1e',
          950: '#000000', // Absolute Black
        },
        dark: {
          950: '#000000', // Pitch Black background
          900: '#050505', // Almost Black
          850: '#0a0a0a', // Dark Gray
          800: '#121212', // Standard Dark
        },
        // Functional Colors (kept minimal)
        success: '#333333', // Dark Gray for success
        warning: '#555555', // Medium Gray
        error: '#777777', // Light Gray
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'gradient-x': 'gradientX 15s ease infinite',
        'gradient-y': 'gradientY 15s ease infinite',
        'blob': 'blob 7s infinite',
        'text-reveal': 'textReveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        gradientY: {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center center' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        textReveal: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0))',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 255, 255, 0.1)',
        'neon-strong': '0 0 30px rgba(255, 255, 255, 0.2)',
        'glass': '0 8px 32px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
