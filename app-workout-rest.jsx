/* global React, FT */
// app-workout-rest.jsx — Rest timer overlay + RPE/RIR helpers
//
// The pause-first heart of the workout: a circular timer that fills,
// inline reps/RPE/form/note logging during the rest, and audio feedback
// when the rest ends. Companion to app-workout.jsx.

const { useState: useStateRT, useEffect: useEffectRT, useRef: useRefRT } = React;

const VIDEO_SUPPORTED_REST = ['squat', 'bench', 'deadlift'];

// ─────────────────────────────────────────────────────────────
// REST TIMER OVERLAY — pause + inline data entry
// ─────────────────────────────────────────────────────────────
function RestTimerOverlay({ theme, state, setState, exercise, setIdx, weight, set, nextLabel, duration, onUpdateSet, onClose, onOpenPlates }) {
  const [extra, setExtra] = useStateRT(0);
  const [now, setNow] = useStateRT(Date.now());
  const [videoOpen, setVideoOpen] = useStateRT(false);
  const startedRef = useRefRT(Date.now());
  const bellPlayedRef = useRefRT(false);

  useEffectRT(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  const elapsed = (now - startedRef.current) / 1000;
  const total = duration + extra;
  const remaining = Math.max(0, total - elapsed);
  const pct = Math.max(0, Math.min(1, elapsed / total));

  useEffectRT(() => {
    if (remaining <= 0 && !bellPlayedRef.current) {
      bellPlayedRef.current = true;
      FT.playSound(state.settings.soundKind, state.settings);
    }
  }, [remaining, state.settings]);

  const r = 100, cx = 120, cy = 120, circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct);
  const overdue = remaining <= 0;

  const rpeMode = state.settings.rpeMode;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: 60, paddingBottom: 20,
      overflowY: 'auto',
      animation: 'fadeIn .2s',
    }}>
      {/* Timer (top, compact) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 22px 14px' }}>
        <Label theme={theme}>Pause · {exercise.name} · Satz {setIdx + 1}</Label>
        <div style={{ height: 8 }} />
        <div style={{ position: 'relative', width: 240, height: 240 }}>
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.surface2} strokeWidth="12" />
            <circle cx={cx} cy={cy} r={r} fill="none"
              stroke={overdue ? theme.success : theme.accent} strokeWidth="12"
              strokeLinecap="round" strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dashoffset .3s linear, stroke .3s' }} />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontSize: 56, fontWeight: 800, fontFamily: theme.fontDisplay,
              color: overdue ? theme.success : theme.text,
              fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
            }}>
              {overdue ? 'GO!' : FT.fmtTime(remaining)}
            </div>
            {!overdue && (
              <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: -2 }}>
                von {FT.fmtTime(total)}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: theme.muted, fontFamily: theme.fontMono }}>
          Als Nächstes: <strong style={{ color: theme.mutedStrong }}>{nextLabel}</strong>
        </div>
      </div>

      {/* LOG SECTION — entered DURING the pause */}
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{
          padding: 14, borderRadius: theme.radiusLg,
          background: theme.surface, border: `1px solid ${theme.borderStrong}`,
        }}>
          <Label theme={theme} style={{ marginBottom: 10 }}>Diesen Satz protokollieren</Label>

          {/* Reps + Plate */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <Label theme={theme} style={{ marginBottom: 4 }}>Wdh</Label>
              <Stepper theme={theme} value={set.reps ?? exercise.reps}
                onChange={v => onUpdateSet({ reps: v })} />
            </div>
            <div style={{ flex: 1 }}>
              <Label theme={theme} style={{ marginBottom: 4 }}>Gewicht</Label>
              <div style={{
                padding: '8px 10px', borderRadius: theme.radius,
                background: theme.bg, border: `1px solid ${theme.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: theme.fontDisplay }}>
                  {FT.fmtWeight(weight)}<span style={{ fontSize: 10, color: theme.muted, marginLeft: 2 }}>kg</span>
                </span>
                {exercise.type === 'compound' && (
                  <button onClick={onOpenPlates} style={{
                    background: theme.surface2, border: `1px solid ${theme.border}`,
                    color: theme.muted, padding: '4px 8px', borderRadius: 4,
                    fontSize: 10, cursor: 'pointer', fontFamily: theme.fontMono,
                  }}>Plates</button>
                )}
              </div>
            </div>
          </div>

          {/* RPE / RIR */}
          <Label theme={theme} style={{ marginBottom: 6 }}>
            {rpeMode === 'rir' ? 'RIR — Reps in Reserve' : 'RPE — wie schwer war\'s?'}
          </Label>
          {rpeMode === 'rir' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 10 }}>
              {[4, 3, 2, 1, 0].map(rir => {
                const rpe = FT.rirToRpe(rir);
                const active = set.rpe === rpe;
                return (
                  <button key={rir} onClick={() => onUpdateSet({ rpe })} style={rpeBtnStyle(theme, active, rir <= 1)}>
                    {rir}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 10 }}>
              {[5, 6, 7, 8, 9, 10].map(n => {
                const active = set.rpe === n;
                return (
                  <button key={n} onClick={() => onUpdateSet({ rpe: n })} style={rpeBtnStyle(theme, active, n >= 9)}>
                    {n}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ fontSize: 10.5, color: theme.muted, fontFamily: theme.fontMono, marginBottom: 10, lineHeight: 1.5 }}>
            {set.rpe ? (rpeMode === 'rir' ? rirDescription(FT.rpeToRir(set.rpe)) : rpeDescription(set.rpe)) : 'Tap einen Wert'}
          </div>

          {/* Form-Tag */}
          <Label theme={theme} style={{ marginBottom: 6 }}>Form</Label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {[
              { v: 'sauber',   label: '✓ Sauber',  c: theme.success },
              { v: 'wacklig',  label: '~ Wacklig', c: theme.accent2 },
              { v: 'spotter',  label: '! Spotter', c: theme.danger },
            ].map(o => (
              <button key={o.v} onClick={() => onUpdateSet({ form: o.v })} style={{
                flex: 1, padding: '8px 6px', borderRadius: theme.radius,
                background: set.form === o.v ? o.c + '20' : 'transparent',
                color: set.form === o.v ? o.c : theme.muted,
                border: `1px solid ${set.form === o.v ? o.c + '60' : theme.border}`,
                fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{o.label}</button>
            ))}
          </div>

          {/* Note */}
          <input value={set.note || ''} onChange={e => onUpdateSet({ note: e.target.value })}
            placeholder="Notiz (optional)"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 12px', borderRadius: theme.radius,
              background: theme.bg, border: `1px solid ${theme.border}`,
              color: theme.text, fontSize: 12, fontFamily: 'inherit', outline: 'none',
            }} />
        </div>
      </div>

      {/* Video-Analyse Quick-Action (nur bei unterstützten Übungen) */}
      {VIDEO_SUPPORTED_REST.includes(exercise.id) && setState && (
        <div style={{ padding: '0 22px 10px' }}>
          <button onClick={() => setVideoOpen(true)} style={{
            width: '100%', padding: '12px 14px', borderRadius: theme.radius,
            background: theme.surface, border: `1px solid ${theme.border}`,
            color: theme.text, fontSize: 12, fontWeight: 700,
            fontFamily: 'inherit', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>📹 Letzten Satz analysieren</span>
            <span style={{ color: theme.muted, fontSize: 11, fontFamily: theme.fontMono }}>
              Winkel-Check →
            </span>
          </button>
        </div>
      )}

      {/* Controls + close */}
      <div style={{ padding: '0 22px', display: 'flex', gap: 8, marginBottom: 10 }}>
        <RestCtl theme={theme} onClick={() => setExtra(extra - 15)}>−15 s</RestCtl>
        <RestCtl theme={theme} onClick={() => setExtra(extra + 30)}>+30 s</RestCtl>
        <RestCtl theme={theme} onClick={() => { startedRef.current = Date.now() - total * 1000; bellPlayedRef.current = true; }}>Skip</RestCtl>
      </div>
      <div style={{ padding: '0 22px' }}>
        <Btn theme={theme} kind={overdue ? 'primary' : 'secondary'} full onClick={onClose}>
          {overdue ? 'Weiter →' : 'Fertig & weiter'}
        </Btn>
      </div>

      {/* Inline Video-Analyse Modal (über dem Rest-Overlay) */}
      {videoOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200,
          background: theme.bg,
          display: 'flex', flexDirection: 'column',
          paddingTop: 20, paddingBottom: 20,
          overflowY: 'auto',
          animation: 'fadeIn .15s',
        }}>
          <VideoTab
            theme={theme}
            state={state}
            setState={setState}
            defaultExerciseId={exercise.id}
            onClose={() => setVideoOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function rpeBtnStyle(theme, active, hard) {
  const c = hard ? theme.danger : theme.accent;
  return {
    padding: '12px 0', borderRadius: theme.radius,
    background: active ? c : theme.bg,
    color: active ? theme.accentText : theme.text,
    border: `1px solid ${active ? c : theme.border}`,
    fontSize: 14, fontWeight: 700, fontFamily: theme.fontDisplay,
    cursor: 'pointer',
  };
}

function rpeDescription(n) {
  return ({
    5: 'sehr leicht · 5+ in Reserve',
    6: 'leicht · 4 in Reserve',
    7: 'moderat · 3 in Reserve',
    8: 'schwer · 2 in Reserve  ◀ Ziel',
    9: 'sehr schwer · 1 in Reserve',
    10: 'maximal · keine Reserve',
  })[n] || '';
}

function rirDescription(rir) {
  return ({
    0: 'maximal · keine Reserve',
    1: 'sehr schwer · 1 in Reserve',
    2: 'schwer · 2 in Reserve  ◀ Ziel',
    3: 'moderat · 3 in Reserve',
    4: 'leicht · 4+ in Reserve',
  })[rir] || '';
}

function Stepper({ theme, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: theme.bg, borderRadius: theme.radius,
      border: `1px solid ${theme.border}`, padding: '4px 6px',
    }}>
      <button onClick={() => onChange(Math.max(0, (value || 0) - 1))} style={tinyBtnRT(theme)}>−</button>
      <span style={{ fontSize: 20, fontWeight: 800, fontFamily: theme.fontDisplay,
        fontVariantNumeric: 'tabular-nums', minWidth: 24, textAlign: 'center' }}>{value ?? 0}</span>
      <button onClick={() => onChange((value || 0) + 1)} style={tinyBtnRT(theme)}>+</button>
    </div>
  );
}

function tinyBtnRT(theme) {
  return {
    width: 28, height: 28, borderRadius: theme.radius,
    background: theme.surface, border: `1px solid ${theme.border}`,
    color: theme.text, fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

function RestCtl({ theme, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 0', borderRadius: theme.radius,
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${theme.border}`,
      color: theme.text, fontWeight: 700, fontSize: 12, fontFamily: theme.fontMono,
      cursor: 'pointer',
    }}>{children}</button>
  );
}

window.RestTimerOverlay = RestTimerOverlay;
