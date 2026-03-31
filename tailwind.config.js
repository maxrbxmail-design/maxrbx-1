/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        // Cyber Chrome palette
        cyan: {
          DEFAULT: '#00FFFF',
          400: '#22d3ee',   // Tailwind cyan-400 (used for mid tones)
          500: '#06b6d4',
        },
        chrome: {
          light: '#e8e8e8',
          mid:   '#a0a0a0',
          dark:  '#606060',
        },
      },
      boxShadow: {
        'cyan-glow':  '0 0 20px rgba(0, 255, 255, 0.25)',
        'cyan-glow-lg': '0 0 40px rgba(0, 255, 255, 0.35)',
        'chrome': '0 2px 8px rgba(255,255,255,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
