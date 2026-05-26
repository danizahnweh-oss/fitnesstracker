/* global React, FT */
// app-recovery.jsx — Pre-session check (Schlaf, Soreness, Energie, Wasser)
// + PR Celebration overlay

const { useState: useStateR, useEffect: useEffectR } = React;

function RecoveryCheck({ theme, sessionName, onContinue, onSkip }) {
  const [sleep, setSleep] = useStateR(3);
  const [soreness, setSoreness] = useStateR(2);
  const [energy, setEnergy] = useStateR(3);
  const [drank, setDrank] = useStateR(false);

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
      <Heading theme={theme} size="lg" style={{ color: theme.text, fontSize: 26, lineHeight: 1.1 }}>
        Wie bist du heut drauf?
      </Heading>
      <div style={{ fontSize: 12, color: theme.muted, marginTop: 6, marginBottom: 22 }}>
        Vor {sessionName} — 30 Sekunden, ehrlich.
      </div>

      <RecoveryRow theme={theme} icon="😴" label="Schlaf"
        sub={['mies', 'wenig', 'okay', 'gut', 'top']}
        value={sleep} onChange={setSleep} />
      <RecoveryRow theme={theme} icon="🥵" label="Muskelkater"
        sub={['keiner', 'leicht', 'spürbar', 'stark', 'übel']}
        value={soreness} onChange={setSoreness} />
      <RecoveryRow theme={theme} icon="⚡" label="Energie"
        sub={['leer', 'müde', 'okay', 'gut', 'aufgeladen']}
        value={energy} onChange={setEnergy} />

      <div style={{
        marginTop: 6, padding: '14px 16px', borderRadius: theme.radius,
        background: theme.surface, border: `1px solid ${theme.border}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 22 }}>💧</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Pre-Workout getrunken?</div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>2 Gläser Wasser empfohlen</div>
        </div>
        <button onClick={() => setDrank(!drank)} style={{
          width: 50, height: 30, borderRadius: 15, padding: 2,
          background: drank ? theme.success : theme.surface2,
          border: `1px solid ${theme.border}`, cursor: 'pointer',
          transition: 'background .15s',
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: drank ? theme.accentText : theme.muted,
            transform: drank ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform .15s',
          }} />
        </button>
      </div>

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

function RecoveryRow({ theme, icon, label, sub, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
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
            padding: '10px 0', borderRadius: theme.radius,
            background: value === n ? theme.accent : theme.surface,
            color: value === n ? theme.accentText : theme.muted,
            border: `1px solid ${value === n ? theme.accent : theme.border}`,
            fontSize: 13, fontWeight: 800, fontFamily: theme.fontDisplay,
            cursor: 'pointer', transition: 'background .12s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PR CELEBRATION — overlay that briefly shows when a PR was hit
// ─────────────────────────────────────────────────────────────
function PRCelebration({ theme, prs, onDismiss }) {
  // Auto-dismiss after a moment
  useEffectR(() => {
    const id = setTimeout(onDismiss, 6500);
    return () => clearTimeout(id);
  }, [onDismiss]);

  if (!prs || !prs.length) return null;

  // Build a couple confetti pieces (CSS animation)
  const confetti = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 0.5,
    duration: 1.6 + Math.random() * 1.2,
    color: [theme.accent, theme.accent2 || theme.success, theme.success, '#FFFFFF'][i % 4],
    size: 6 + Math.random() * 8,
    rot: Math.random() * 360,
  }));

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      overflow: 'hidden', cursor: 'pointer', animation: 'fadeIn .25s',
    }} onClick={onDismiss}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-100px) rotate(var(--r,0deg)); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(900px) rotate(calc(var(--r,0deg) + 720deg)); opacity: 0; }
        }
      `}</style>
      {confetti.map(c => (
        <div key={c.id} style={{
          position: 'absolute', top: 0, left: `${c.left}%`,
          width: c.size, height: c.size * 0.4,
          background: c.color, borderRadius: 2,
          '--r': `${c.rot}deg`,
          animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`,
        }} />
      ))}
      <div style={{ textAlign: 'center', padding: 30, position: 'relative' }}>
        <div style={{ fontSize: 72, lineHeight: 1 }}>🏆</div>
        <div style={{
          marginTop: 14, fontSize: 36, fontWeight: 800,
          fontFamily: theme.fontDisplay, color: theme.accent,
          letterSpacing: theme.upperHeads ? 1 : -0.5,
          textTransform: theme.upperHeads ? 'uppercase' : 'none',
        }}>
          Neuer PR{prs.length > 1 ? 's' : ''}!
        </div>
        <div style={{ height: 18 }} />
        {prs.map(pr => (
          <div key={pr.id} style={{
            margin: '0 auto 10px', padding: '12px 18px', maxWidth: 280,
            borderRadius: theme.radius, background: theme.surface,
            border: `1px solid ${theme.accent}60`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
              {pr.name}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: theme.muted, fontFamily: theme.fontMono }}>
              {FT.fmtWeight(pr.weight)}kg × {pr.reps} · 1RM est. <span style={{ color: theme.success }}>{pr.est}kg</span>
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
