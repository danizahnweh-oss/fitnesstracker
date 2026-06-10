/* global React, FT */
// app-plates.jsx - Plate calculator overlay + barbell visual

const { useState: useStatePl, useEffect: useEffectPl, useRef: useRefPl } = React;

// ─────────────────────────────────────────────────────────────
// PLATE CALCULATOR OVERLAY
// ─────────────────────────────────────────────────────────────
function PlateCalculator({ theme, target: initialTarget, bar: initialBar, onClose }) {
  const [target, setTarget] = useStatePl(initialTarget || 60);
  const [bar, setBar] = useStatePl(initialBar || 20);
  const closeRef = useRefPl(null);
  const calc = FT.calcPlates(target, bar);

  useEffectPl(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="plate-calculator-title" style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
      overscrollBehavior: 'contain',
      animation: 'fadeIn .2s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        marginTop: 'auto', padding: 22, paddingBottom: 36,
        background: theme.surface, borderRadius: `${theme.radiusXl}px ${theme.radiusXl}px 0 0`,
        borderTop: `1px solid ${theme.borderStrong}`,
      }}>
        <div style={{ width: 40, height: 4, background: theme.border, borderRadius: 2, margin: '0 auto 18px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <Heading theme={theme} size="lg" style={{}}><span id="plate-calculator-title">Scheibenrechner</span></Heading>
          <button ref={closeRef} type="button" onClick={onClose} style={{
            background: 'transparent', border: 'none', color: theme.muted,
            fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>Schließen</button>
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 2 }}>
            <Label theme={theme} htmlFor="plate-target" style={{ marginBottom: 4 }}>Gesamt</Label>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: theme.surface2, borderRadius: theme.radius,
              border: `1px solid ${theme.border}`, padding: '4px 6px',
            }}>
              <button type="button" aria-label="Gesamtgewicht verringern" onClick={() => setTarget(Math.max(bar, target - 2.5))}
                style={{ ...tinyBtnPl(theme), width: 44 }}>−</button>
              <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, minWidth: 0 }}>
                <input id="plate-target" name="plateTarget" type="number" min={bar} step="2.5" inputMode="decimal"
                  aria-label="Gesamtgewicht in Kilogramm"
                  value={target} onChange={e => setTarget(parseFloat(e.target.value) || 0)}
                  style={{
                    textAlign: 'right', background: 'transparent', border: 'none',
                    color: theme.text, fontSize: 32, fontWeight: 800, fontFamily: theme.fontDisplay,
                    outline: 'none', width: '100%', minWidth: 0,
                  }} />
                <span aria-hidden="true" style={{
                  fontSize: 11, fontWeight: 700, fontFamily: theme.fontUI,
                  letterSpacing: 0.6, textTransform: 'uppercase', color: theme.muted, flexShrink: 0,
                }}>kg</span>
              </div>
              <button type="button" aria-label="Gesamtgewicht erhöhen" onClick={() => setTarget(target + 2.5)}
                style={{ ...tinyBtnPl(theme), width: 44 }}>+</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Label theme={theme} htmlFor="plate-bar" style={{ marginBottom: 4 }}>Stange</Label>
            <select id="plate-bar" name="plateBar" value={bar} onChange={e => setBar(parseFloat(e.target.value))} style={{
              width: '100%', padding: '13px 30px 13px 10px', borderRadius: theme.radius,
              backgroundColor: theme.surface2, border: `1px solid ${theme.border}`,
              color: theme.text, fontSize: 16, fontWeight: 700,
              fontFamily: 'inherit', outline: 'none',
              appearance: 'none', WebkitAppearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 9px center',
            }}>
              <option value="20">20 kg</option>
              <option value="15">15 kg</option>
              <option value="10">10 kg</option>
              <option value="7">7 kg (SZ)</option>
            </select>
          </div>
        </div>

        {/* Visual barbell */}
        <div aria-live="polite" style={{
          padding: '20px 0', background: theme.bgGrad, borderRadius: theme.radius,
          marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 90, overflow: 'hidden',
        }}>
          <BarbellVisual theme={theme} plates={calc.plates} />
        </div>

        {/* Per-side list */}
        <div style={{
          background: theme.surface2, borderRadius: theme.radius,
          padding: '12px 14px', marginBottom: 10,
          border: `1px solid ${theme.border}`,
        }}>
          <Label theme={theme} style={{ marginBottom: 6 }}>Pro Seite</Label>
          {calc.ok ? (
            calc.plates.length === 0 ? (
              <div style={{ fontSize: 13, color: theme.muted }}>Nur die Stange - keine Scheiben nötig.</div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: theme.fontMono, color: theme.text }}>
                {countPlates(calc.plates).map((p, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: theme.muted, margin: '0 6px' }}>·</span>}
                    {p.count}×{FT.fmtWeight(p.weight)}kg
                  </span>
                ))}
              </div>
            )
          ) : (
            <div style={{ fontSize: 13, color: theme.danger }}>
              Nicht exakt möglich · Rest {FT.fmtWeight(calc.remainder)}kg pro Seite
            </div>
          )}
        </div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[40, 50, 60, 70, 80, 100, 120].map(w => (
            <button key={w} type="button" onClick={() => setTarget(w)} style={{
              padding: '12px 14px', minHeight: 44, borderRadius: theme.radius,
              background: target === w ? theme.accent2 : 'transparent',
              color: target === w ? theme.accentText : theme.muted,
              border: `1px solid ${target === w ? theme.accent2 : theme.border}`,
              fontSize: 13, fontWeight: 700, fontFamily: theme.fontMono,
              cursor: 'pointer',
            }}>{w}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function tinyBtnPl(theme) {
  return {
    width: 44, height: 44, borderRadius: theme.radius,
    background: theme.surface2, border: `1px solid ${theme.border}`,
    color: theme.muted, fontSize: 18, fontWeight: 700, fontFamily: 'inherit',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };
}

function countPlates(plates) {
  const m = {};
  plates.forEach(p => { m[p] = (m[p] || 0) + 1; });
  return Object.entries(m)
    .map(([w, c]) => ({ weight: parseFloat(w), count: c }))
    .sort((a, b) => b.weight - a.weight);
}

// Visual: bar + plates stacked from inside out, mirrored
function BarbellVisual({ theme, plates }) {
  const colors = FT.PLATE_COLORS;
  const sizes = { 25: 60, 20: 56, 15: 52, 10: 46, 5: 36, 2.5: 28, 1.25: 22 };
  // sort descending so big plates go inside
  const sorted = [...plates].sort((a, b) => b - a);
  const sleeve = sorted.map((p, i) => ({ p, key: i }));

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Left collar + plates */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'row-reverse' }}>
        {sleeve.map(({ p, key }) => (
          <div key={'l-' + key} style={{
            width: 8, height: sizes[p] || 30,
            background: colors[p] || '#888',
            border: '1px solid rgba(0,0,0,0.4)',
            borderRadius: 2,
          }} title={`${p}kg`} />
        ))}
      </div>
      {/* Bar sleeve */}
      <div style={{ width: 26, height: 8, background: theme.muted, borderRadius: 1 }} />
      {/* Bar shaft */}
      <div style={{ width: 50, height: 6, background: theme.border, borderRadius: 0 }} />
      <div style={{ width: 26, height: 8, background: theme.muted, borderRadius: 1 }} />
      {/* Right plates */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {sleeve.map(({ p, key }) => (
          <div key={'r-' + key} style={{
            width: 8, height: sizes[p] || 30,
            background: colors[p] || '#888',
            border: '1px solid rgba(0,0,0,0.4)',
            borderRadius: 2,
          }} title={`${p}kg`} />
        ))}
      </div>
    </div>
  );
}

window.PlateCalculator = PlateCalculator;
