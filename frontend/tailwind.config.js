/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          dark: '#0a0a0f',
          darker: '#050508',
          card: '#12121a',
          border: '#1f1f2e',
          red: '#dc2626',
          'red-dark': '#991b1b',
          'red-glow': '#ef4444',
          accent: '#ff3b3b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #dc2626, 0 0 10px #dc2626' },
          '100%': { boxShadow: '0 0 20px #dc2626, 0 0 30px #dc2626' },
        },
      },
    },
  },
  plugins: [],
};
