// themes.js — three visual systems sharing the same UX flow

const THEMES = {

  // ── 1) BEAST MODE — black + ember orange/red, heavy display, sharp ───────
  beast: {
    id: 'beast',
    name: 'Beast Mode',
    tagline: 'Heavy. Loud. Built for grinders.',

    bg: '#0A0908',
    bgGrad: 'radial-gradient(ellipse at top, #1A0F0A 0%, #0A0908 65%)',
    surface: '#15110E',
    surface2: '#1F1813',
    border: 'rgba(255,255,255,0.07)',
    borderStrong: 'rgba(255,255,255,0.14)',

    text: '#FAF7F2',
    muted: 'rgba(250,247,242,0.55)',
    mutedStrong: 'rgba(250,247,242,0.78)',

    accent: '#FF4D14',         // ember
    accent2: '#FFB020',        // gold
    accentText: '#0A0908',
    success: '#84CC16',
    danger: '#EF4444',

    fontUI: '"Inter", system-ui, sans-serif',
    fontDisplay: '"Anton", "Bebas Neue", "Oswald", "Inter", sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',

    radius: 10, radiusLg: 16, radiusXl: 22,
    weightUi: 600, weightDisplay: 400, weightHeavy: 800,
    upperHeads: true,
    pillFill: '#FF4D14',
    pillText: '#0A0908',
    cardShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 30px -22px rgba(0,0,0,0.7)',
  },

  // ── 2) IRON PULSE — charcoal navy + lime, rounded, modern ────────────────
  iron: {
    id: 'iron',
    name: 'Iron Pulse',
    tagline: 'Clean, calm, controlled.',

    bg: '#0C1217',
    bgGrad: 'radial-gradient(ellipse at top right, #14252A 0%, #0C1217 60%)',
    surface: '#141D24',
    surface2: '#1B2730',
    border: 'rgba(163,230,53,0.10)',
    borderStrong: 'rgba(163,230,53,0.25)',

    text: '#EEF6F0',
    muted: 'rgba(220,235,225,0.55)',
    mutedStrong: 'rgba(220,235,225,0.80)',

    accent: '#A3E635',         // lime
    accent2: '#34D399',        // mint
    accentText: '#0C1217',
    success: '#A3E635',
    danger: '#F87171',

    fontUI: '"Space Grotesk", "Inter", system-ui, sans-serif',
    fontDisplay: '"Space Grotesk", "Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',

    radius: 16, radiusLg: 24, radiusXl: 32,
    weightUi: 500, weightDisplay: 600, weightHeavy: 700,
    upperHeads: false,
    pillFill: '#A3E635',
    pillText: '#0C1217',
    cardShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 40px -28px rgba(0,0,0,0.6)',
  },

  // ── 3) NEON LIFT — deep violet + cyan, mono, minimal-futuristic ──────────
  neon: {
    id: 'neon',
    name: 'Neon Lift',
    tagline: 'Numbers first. Minimal. Sharp.',

    bg: '#08060F',
    bgGrad: 'radial-gradient(ellipse at bottom, #1A0E2E 0%, #08060F 60%)',
    surface: '#0F0A1C',
    surface2: '#16102A',
    border: 'rgba(140,100,255,0.15)',
    borderStrong: 'rgba(34,211,238,0.35)',

    text: '#F1ECFF',
    muted: 'rgba(220,200,255,0.55)',
    mutedStrong: 'rgba(220,200,255,0.85)',

    accent: '#22D3EE',         // cyan
    accent2: '#A855F7',        // violet
    accentText: '#08060F',
    success: '#22D3EE',
    danger: '#FB7185',

    fontUI: '"JetBrains Mono", ui-monospace, monospace',
    fontDisplay: '"JetBrains Mono", ui-monospace, monospace',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',

    radius: 4, radiusLg: 6, radiusXl: 8,
    weightUi: 500, weightDisplay: 500, weightHeavy: 700,
    upperHeads: true,
    pillFill: '#22D3EE',
    pillText: '#08060F',
    cardShadow: '0 0 0 1px rgba(34,211,238,0.06) inset, 0 0 40px -10px rgba(34,211,238,0.15)',
  },
};

window.THEMES = THEMES;
