/* global React, FT */
// app-recovery.jsx - Pre-session check (Schlaf, Soreness, Energie, Wasser)
// + PR Celebration overlay

const { useState: useStateR, useEffect: useEffectR } = React;

// Pre-Check pro Tag in localStorage halten (so überlebt er Reload am selben Tag)
const recoveryDayKey = () => `fittracker_recovery_${FT.todayISO()}`;
function loadRecoveryDay() {
  try { return JSON.parse(localStorage.getItem(recoveryDayKey()) || 'null') || {}; }
  catch { return {}; }
}
function saveRecoveryDay(data) {
  try { localStorage.setItem(recoveryDayKey(), JSON.stringify(data)); }
  catch (e) { console.warn('recovery save failed', e); }
}

function RecoveryCheck({ theme, sessionName, onContinue, onSkip }) {
  const saved = loadRecoveryDay();
  const [sleep, setSleep] = useStateR(saved.sleep ?? 3);
  const [soreness, setSoreness] = useStateR(saved.soreness ?? 2);
  const [energy, setEnergy] = useStateR(saved.energy ?? 3);
  const [drank, setDrank] = useStateR(saved.drank ?? false);

  useEffectR(() => {
    saveRecoveryDay({ sleep, soreness, energy, drank });
  }, [sleep, soreness, energy, drank]);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 90,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column',
      padding: `calc(40px + ${theme.padTop || '30px'}) 22px calc(30px + ${theme.padBot || '0px'})`, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
      animation: 'fadeIn .2s',
    }}>
      <Label theme={theme}>Pre-Check</Label>
      <div style={{ height: 8 }} />
      <Heading theme={theme} size="xl" style={{ color: theme.text, lineHeight: 1.1 }}>
        Wie bist du heut drauf?
      </Heading>
      <div style={{ fontSize: 12, color: theme.muted, marginTop: 6, marginBottom: 22 }}>
        Vor {sessionName} - 30 Sekunden, ehrlich.
      </div>

      <RecoveryRow theme={theme} icon="sleep" label="Schlaf"
        sub={['mies', 'wenig', 'okay', 'gut', 'top']}
        value={sleep} onChange={setSleep} />
      <RecoveryRow theme={theme} icon="soreness" label="Muskelkater"
        sub={['keiner', 'leicht', 'spürbar', 'stark', 'übel']}
        value={soreness} onChange={setSoreness} />
      <RecoveryRow theme={theme} icon="energy" label="Energie"
        sub={['leer', 'müde', 'okay', 'gut', 'aufgeladen']}
        value={energy} onChange={setEnergy} />

      <button
        onClick={() => setDrank(!drank)}
        role="switch"
        aria-checked={drank}
        aria-label="Pre-Workout getrunken?"
        style={{
          marginTop: 6, width: '100%', minHeight: 56, padding: '14px 16px',
          borderRadius: theme.radius, textAlign: 'left',
          background: theme.surface, border: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          fontFamily: 'inherit', color: theme.text,
        }}>
        <RecoveryIcon name="water" theme={theme} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Pre-Workout getrunken?</div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>2 Gläser Wasser empfohlen</div>
        </div>
        <div aria-hidden="true" style={{
          width: 50, height: 30, borderRadius: 15, padding: 2, flexShrink: 0,
          background: drank ? theme.success : theme.surface2,
          border: `1px solid ${theme.border}`,
          transition: 'background .15s',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: drank ? theme.accentText : theme.muted,
            transform: drank ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform .15s',
          }} />
        </div>
      </button>

      <div style={{ height: 18 }} />
      <Btn theme={theme} kind="primary" full
        onClick={() => onContinue({ sleep, soreness, energy, drank })}>
        Los geht's →
      </Btn>
      <button onClick={onSkip} style={{
        marginTop: 10, background: 'transparent', border: 'none',
        color: theme.muted, fontSize: 12, cursor: 'pointer',
        padding: '8px 0', fontFamily: 'inherit',
      }}>Überspringen</button>
    </div>
  );
}

// Monochrome stroke glyphs (currentColor) — replace System-Emoji
function RecoveryIcon({ name, theme, size = 20 }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.2,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { color: theme.muted, flexShrink: 0 },
    'aria-hidden': true,
  };
  const paths = {
    // Schlaf – Mond
    sleep: <path d="M20 14a8 8 0 1 1-9.8-9.8A6.5 6.5 0 0 0 20 14Z" />,
    // Muskelkater – Flamme/Hitze
    soreness: <path d="M12 3c1.5 3 4.5 4.2 4.5 8a4.5 4.5 0 1 1-9 0c0-1.8 1-3 1.8-4 .3 .8 .9 1.3 1.7 1.5C10.3 6.5 10.8 4.7 12 3Z" />,
    // Energie – Blitz
    energy: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
    // Wasser – Tropfen
    water: <path d="M12 3c3.5 4 6 6.8 6 10a6 6 0 1 1-12 0c0-3.2 2.5-6 6-10Z" />,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
}

function RecoveryRow({ theme, icon, label, sub, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <RecoveryIcon name={icon} theme={theme} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: 1 }}>
            {sub[value - 1]}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            padding: '13px 0', minHeight: 44, borderRadius: theme.radius,
            background: value === n ? theme.surface2 : theme.surface,
            color: value === n ? theme.text : theme.muted,
            border: `1px solid ${value === n ? theme.accent2 : theme.border}`,
            fontSize: 13, fontWeight: 800, fontFamily: theme.fontDisplay,
            cursor: 'pointer', transition: 'background .12s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PR CELEBRATION - overlay that briefly shows when a PR was hit
// ─────────────────────────────────────────────────────────────
function PRCelebration({ theme, prs, onDismiss }) {
  // Auto-dismiss erst nach >=10s; bei reduzierter Bewegung gar nicht (nur Tap).
  useEffectR(() => {
    const reduce = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setTimeout(onDismiss, 11000);
    return () => clearTimeout(id);
  }, [onDismiss]);

  if (!prs || !prs.length) return null;

  // Held: der erste (stärkste) PR steht groß im Zentrum.
  const hero = prs[0];
  const delta = hero.delta != null
    ? hero.delta
    : (hero.prev != null ? hero.est - hero.prev : null);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      overflow: 'hidden', cursor: 'pointer', animation: 'fadeIn .25s',
    }} onClick={onDismiss}>
      <div style={{ textAlign: 'center', padding: 30, position: 'relative' }}>
        <div style={{
          fontFamily: theme.fontUI, fontSize: 11, fontWeight: 700,
          letterSpacing: 1.5, textTransform: 'uppercase', color: theme.muted,
          marginBottom: 14,
        }}>
          Neuer PR{prs.length > 1 ? 's' : ''}
        </div>

        {/* Held: est. 1RM, groß, Ember, einzelner Glow-Ring */}
        <div style={{
          margin: '0 auto', width: 'fit-content',
          padding: '6px 30px', borderRadius: theme.radiusXl,
          boxShadow: `0 0 60px -10px ${theme.accent}`,
        }}>
          <div style={{
            fontFamily: theme.fontDisplay, fontWeight: theme.weightDisplay,
            fontSize: 56, lineHeight: 1, color: theme.accent,
            letterSpacing: theme.upperHeads ? 0.5 : -0.5,
          }}>
            {hero.est}
          </div>
          <div style={{
            fontFamily: theme.fontMono, fontSize: 12, color: theme.muted,
            marginTop: 4, letterSpacing: 0.5,
          }}>
            kg · 1RM est.
          </div>
        </div>

        {/* getönte Ember-Pill mit Delta statt Trophäen-Emoji */}
        {delta != null && delta > 0 && (
          <div style={{
            display: 'inline-block', marginTop: 14,
            padding: '4px 12px', borderRadius: theme.radiusXl,
            background: `${theme.accent}1A`,
            border: `1px solid ${theme.accent}40`,
            fontFamily: theme.fontMono, fontSize: 12, fontWeight: 700,
            color: theme.accent, letterSpacing: 0.5,
          }}>
            +{FT.fmtWeight(delta)}kg
          </div>
        )}

        <div style={{ height: 22 }} />
        {prs.map(pr => (
          <div key={pr.id} style={{
            margin: '0 auto 10px', padding: '12px 18px', maxWidth: 280,
            borderRadius: theme.radius, background: theme.surface,
            border: `1px solid ${theme.border}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
              {pr.name}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: theme.muted, fontFamily: theme.fontMono }}>
              {FT.fmtWeight(pr.weight)}kg × {pr.reps} · 1RM est. <span style={{ color: theme.accent2 }}>{pr.est}kg</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, fontSize: 11, color: theme.muted }}>
          Tap zum Schließen
        </div>
      </div>
    </div>
  );
}

window.RecoveryCheck = RecoveryCheck;
window.PRCelebration = PRCelebration;
