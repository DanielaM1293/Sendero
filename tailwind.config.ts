import type { Config } from 'tailwindcss'

const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'),
        surface: c('surface'),
        surface2: c('surface2'),
        ink: c('ink'),
        muted: c('muted'),
        brand: c('brand'),
        onbrand: c('on-brand'),
        sun: c('sun'),
        lagoon: c('lagoon'),
        panel: c('panel'),
        onpanel: c('on-panel'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        drift: { '0%': { transform: 'translateX(-24px)' }, '100%': { transform: 'translateX(24px)' } },
        twinkle: { '0%,100%': { opacity: '.15' }, '50%': { opacity: '1' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite alternate',
        twinkle: 'twinkle 3s ease-in-out infinite',
        spinslow: 'spinslow 28s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
