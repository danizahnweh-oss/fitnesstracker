/* global React, ReactDOM, THEMES, App, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakSelect, TweakToggle, TweakSlider */
// canvas.jsx — Beast Mode full-bleed prototype + Tweaks panel

// Inject mobile-specific CSS + viewport-fit=cover for safe area insets
(function injectMobileCSS() {
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp && !vp.content.includes('viewport-fit')) {
    vp.content += ', viewport-fit=cover';
  }
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) and (any-pointer: coarse) {
      html, body { overflow: hidden; height: 100dvh; }
      body { background: var(--app-bg, #0A0908) !important; }
    }
    :root {
      --sat: env(safe-area-inset-top, 0px);
      --sab: env(safe-area-inset-bottom, 0px);
      --sal: env(safe-area-inset-left, 0px);
      --sar: env(safe-area-inset-right, 0px);
    }
  `;
  document.head.appendChild(style);
})();

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FF4D14",
  "accent2": "#FFB020",
  "displayFont": "Anton",
  "uppercaseHeads": true,
  "glowIntensity": 1
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  '#FF4D14',  // ember (default)
  '#E11D2E',  // blood red
  '#FFB020',  // gold
  '#FF6FB5',  // hot pink
];

const FONT_OPTIONS = ['Anton', 'Bebas Neue', 'Oswald', 'Inter'];

function useIsMobile() {
  const detect = () => {
    const narrow = window.innerWidth <= 768;
    const touch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    return narrow && touch;
  };
  const [mobile, setMobile] = React.useState(detect);
  React.useEffect(() => {
    const update = () => setMobile(detect());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return mobile;
}

// Track the chosen skin (Beast / Iron / Neon) so the outer chrome
// (mobile full-bleed bg, desktop backdrop, body) follows the selection,
// not just the App subtree. Reuses the persistence wired in app-main.jsx.
function useThemeId() {
  const read = () => (window.FT_THEME ? window.FT_THEME.read() : null);
  const [id, setId] = React.useState(read);
  React.useEffect(() => {
    const onChange = () => setId(read());
    const evt = window.FT_THEME ? window.FT_THEME.EVENT : 'ft:themechange';
    window.addEventListener(evt, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(evt, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);
  return id;
}

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const isMobile = useIsMobile();
  const themeId = useThemeId();

  const theme = React.useMemo(() => {
    const beast = window.THEMES.beast;
    // Beast (or no selection) keeps the editor tweaks; any other skin
    // overlays its own tokens (bg, surfaces, accent, fonts) verbatim.
    const useSkin = themeId && themeId !== 'beast' && window.THEMES[themeId];
    const base = useSkin ? { ...beast, ...window.THEMES[themeId] } : beast;
    const accent = useSkin ? base.accent : t.accent;
    const accent2 = useSkin ? base.accent2 : t.accent2;
    return {
      ...base,
      isMobile,
      padTop: isMobile ? 'calc(env(safe-area-inset-top, 20px) + 12px)' : 56,
      padBot: isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 20px)' : 0,
      accent,
      accent2,
      fontDisplay: useSkin ? base.fontDisplay
        : `"${t.displayFont}", "Bebas Neue", "Oswald", "Inter", sans-serif`,
      upperHeads: useSkin ? base.upperHeads : t.uppercaseHeads,
      cardShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 ${18 * t.glowIntensity}px ${30 * t.glowIntensity}px -22px rgba(0,0,0,0.7), 0 0 ${40 * t.glowIntensity}px -20px ${accent}40`,
      bgGrad: useSkin ? base.bgGrad
        : `radial-gradient(ellipse at top, ${hexAlpha(t.accent, 0.10 * t.glowIntensity)} 0%, #0A0908 65%)`,
    };
  }, [t.accent, t.accent2, t.displayFont, t.uppercaseHeads, t.glowIntensity, isMobile, themeId]);

  // Keep the body backdrop (visible behind safe areas / overscroll) in sync.
  React.useEffect(() => {
    document.documentElement.style.setProperty('--app-bg', theme.bg);
  }, [theme.bg]);

  const stageRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    if (isMobile) return;
    function fit() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 40;
      const sx = (vw - margin * 2) / 390;
      const sy = (vh - margin * 2) / 844;
      setScale(Math.min(1.4, Math.min(sx, sy)));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div style={{
        width: '100vw', height: '100dvh',
        background: theme.bgGrad, color: theme.text,
        fontFamily: theme.fontUI,
        position: 'relative', overflow: 'hidden',
      }}>
        <App theme={theme} />
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: theme.bg,
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, ${hexAlpha(theme.accent, 0.08)} 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, ${hexAlpha(theme.accent2, 0.05)} 0%, transparent 50%)
      `,
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div ref={stageRef} style={{
        transform: `scale(${scale})`, transformOrigin: 'center',
      }}>
        <App theme={theme} />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Akzent">
          <TweakColor label="Primärfarbe" value={t.accent}
            options={ACCENT_OPTIONS}
            onChange={v => setTweak('accent', v)} />
          <TweakColor label="Sekundär" value={t.accent2}
            options={['#FFB020', '#84CC16', '#22D3EE', '#F472B6']}
            onChange={v => setTweak('accent2', v)} />
        </TweakSection>

        <TweakSection label="Typografie">
          <TweakSelect label="Display-Font" value={t.displayFont}
            options={FONT_OPTIONS}
            onChange={v => setTweak('displayFont', v)} />
          <TweakToggle label="UPPERCASE Headlines" value={t.uppercaseHeads}
            onChange={v => setTweak('uppercaseHeads', v)} />
        </TweakSection>

        <TweakSection label="Atmosphäre">
          <TweakSlider label="Glow" value={t.glowIntensity} min={0} max={2} step={0.1}
            onChange={v => setTweak('glowIntensity', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// helper: hex#RRGGBB + alpha → rgba()
function hexAlpha(hex, a) {
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
