import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral';

/**
 * The Sound of Essentials (Rhythm Quest) Astryx theme.
 * Aligned to CONSTRAINTS.md (July 2026 Canon):
 * - Cream #FFF8F0 surface, Vibrant Orange #FF6F00 accent
 * - Fredoka / Bricolage Grotesque headings + Inter body
 * - 50px pill radius on buttons and badges
 */
export const soeTheme = defineTheme({
  name: 'soe',
  extends: neutralTheme,

  typography: {
    scale: { base: 15, ratio: 1.2 },
    body: {
      family: 'Inter',
      fallbacks: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    heading: {
      family: 'Fredoka',
      fallbacks: '"Bricolage Grotesque", "Outfit", sans-serif',
      weights: { 1: 'bold', 2: 'bold', 3: 'bold', 4: 'bold' },
    },
  },

  motion: {
    character: 'expressive',
    tempo: 1.0,
  },

  tokens: {
    '--color-background-surface': '#FFF8F0',
    '--color-background-body': '#FAF9F7',
    '--color-background-card': '#FFFFFF',
    '--color-background-popover': '#FFFFFF',
    '--color-background-muted': '#FFF3E0',

    '--color-accent': '#FF6F00',
    '--color-accent-muted': 'rgba(255, 111, 0, 0.14)',
    '--color-on-accent': '#2B2016',

    '--color-text-primary': '#2B2016',
    '--color-text-secondary': '#5D4037',
    '--color-text-accent': '#E65100',
    '--color-icon-accent': '#FF6F00',

    '--color-border': 'rgba(255, 111, 0, 0.18)',
    '--color-border-emphasized': 'rgba(255, 111, 0, 0.35)',
    '--color-tint-hover': '#FF6F00',

    '--radius-inner': '10px',
    '--radius-element': '12px',
    '--radius-container': '24px',
    '--radius-page': '28px',
    '--radius-full': '9999px',

    '--shadow-inset-hover': 'inset 0px 0px 0px 2px rgba(255, 111, 0, 0.30)',
    '--shadow-inset-selected': 'inset 0px 0px 0px 2px rgba(255, 111, 0, 0.55)',
  },

  components: {
    button: {
      base: {
        borderRadius: '50px',
        fontFamily: 'var(--font-family-heading)',
        fontWeight: '600',
      },
      'variant:primary': {
        background: 'linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)',
        color: '#2B2016',
        boxShadow: '0 4px 14px rgba(255, 111, 0, 0.30)',
      },
    },
    badge: {
      base: {
        borderRadius: '50px',
        fontFamily: 'var(--font-family-heading)',
        fontWeight: '700',
      },
    },
    dialog: {
      base: {
        border: '2px solid rgba(255, 111, 0, 0.25)',
        background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.98), rgba(255, 255, 255, 0.96))',
      },
    },
  },
});
