import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse var(--duration) ease-out infinite',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 var(--pulse-color)' },
          '50%': { boxShadow: '0 0 0 8px var(--pulse-color)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    nextui({
      layout: {
        dividerWeight: '1px',
        disabledOpacity: 0.8,
        fontSize: {
          tiny: '0.875rem',
          small: '1rem',
          medium: '1.125rem',
          large: '1.25rem',
        },
        lineHeight: {
          tiny: '1rem',
          small: '1.25rem',
          medium: '1.5rem',
          large: '1.75rem',
        },
        radius: {
          small: '14px',
          medium: '18px',
          large: '25px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },
      themes: {
        light: {
          layout: {
            hoverOpacity: '0.9',
          },
          colors: {
            secondary: {
              '50': '#000000',
              '100': '#1a1a1a',
              '200': '#333333',
              '300': '#4d4d4d',
              '400': '#666666',
              '500': '#808080',
              '600': '#999999',
              '700': '#b3b3b3',
              '800': '#cccccc',
              '900': '#e6e6e6',
              DEFAULT: '#000000',
              foreground: '#ffffff',
            },
          },
        },
        dark: {
          layout: {
            hoverOpacity: '0.9',
          },
          colors: {
            secondary: {
              '50': '#ffffff',
              '100': '#e6e6e6',
              '200': '#cccccc',
              '300': '#b3b3b3',
              '400': '#999999',
              '500': '#808080',
              '600': '#666666',
              '700': '#4d4d4d',
              '800': '#333333',
              '900': '#1a1a1a',
              DEFAULT: '#ffffff',
              foreground: '#000000',
            },
          },
        },
      },
    }),
  ],
};

export default config;
