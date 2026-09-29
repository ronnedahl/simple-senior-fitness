/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // The site is light-theme only. Kept on the 'class' strategy (rather than the
  // 'media' default) so a stray `dark:` utility can never be triggered by the
  // visitor's OS preference.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#08f7b3',
        'background-light': '#f8fafc',
        'background-dark': '#0f172a', // only used for text on `selection:bg-primary`
        'surface-light': '#ffffff',
        'text-main-light': '#0f172a',
        'text-muted-light': '#475569',
        'accent-dark': '#047857', // deep emerald brand accent (light theme)
        'accent-light': '#10b981',
        // Gumroad guide buy box (GuideCTA.astro). Clay is darkened from #C8553D
        // to reach WCAG AA contrast (5.6:1) for small text on the paper background.
        guide: {
          ink: '#2F4A6D',
          'ink-hover': '#243A57',
          clay: '#A8432E',
          paper: '#FBF8F2',
        },
      },
      fontFamily: {
        display: ['Atkinson Hyperlegible', 'sans-serif'],
        serif: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
