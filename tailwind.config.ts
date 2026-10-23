import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        graphite: 'var(--graphite)',
        carbon: 'var(--carbon)',
        steel: 'var(--steel)',
        bone: 'var(--bone)',
        ash: 'var(--ash)',
        smoke: 'var(--smoke)',
        iron: 'var(--iron)',
        crimson: {
          DEFAULT: 'var(--crimson)',
          hover: 'var(--crimson-hover)',
          press: 'var(--crimson-press)',
          signal: 'var(--crimson-signal)',
          text: 'var(--crimson-text)',
        },
        ember: 'var(--ember)',
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        pill: '999px',
      },
      maxWidth: {
        'text-reading': '42rem',
        'main': '80rem',
        'wide': '96rem',
      },
    },
  },
  plugins: [],
};

export default config;
