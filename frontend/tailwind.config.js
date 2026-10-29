/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Sora"', '"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          950: '#04070d',
          900: '#09111f',
          800: '#101a2b',
          700: '#162439',
        },
        neon: {
          cyan: '#5eead4',
          blue: '#60a5fa',
          lime: '#bef264',
          coral: '#fb7185',
          amber: '#fbbf24',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.45)',
        glow: '0 0 0 1px rgba(94, 234, 212, 0.16), 0 0 32px rgba(96, 165, 250, 0.18)',
        neumorph: '14px 14px 34px rgba(2, 8, 20, 0.45), -10px -10px 24px rgba(29, 78, 216, 0.08)',
      },
      backgroundImage: {
        'mesh-radial': 'radial-gradient(circle at top, rgba(96,165,250,0.22), transparent 30%), radial-gradient(circle at 20% 20%, rgba(94,234,212,0.2), transparent 26%), radial-gradient(circle at 80% 0%, rgba(251,113,133,0.16), transparent 20%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(94, 234, 212, 0.16), 0 0 24px rgba(96, 165, 250, 0.12)' },
          '50%': { boxShadow: '0 0 0 1px rgba(94, 234, 212, 0.28), 0 0 48px rgba(96, 165, 250, 0.24)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-110%)' },
          '100%': { transform: 'translateY(300%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        scan: 'scan 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
