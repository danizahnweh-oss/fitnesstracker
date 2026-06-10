/* global React, FT */
// app-mobility.jsx - Mobility-Sessions (Beweglichkeit, getrennt vom Krafttraining)
//
// View 1: Routinen-Auswahl + kurze Historie.
// View 2: Aktive Session - pro Übung Bleistift-Illustration aus poses/<id>.jpg,
//         Timer (oder Wdh), aufklappbare Anleitung.
//         Speichert {date, routineId, durationSec, completed} in state.mobility.

const { useState: useStateMob, useEffect: useEffectMob, useRef: useRefMob } = React;

function MobilityPose({ theme, pose }) {
  // Bild aus poses/<pose>.jpg laden. Wenn nicht vorhanden → leere Papier-Karte.
  const [imgFailed, setImgFailed] = useStateMob(false);
  useEffectMob(() => { setImgFailed(false); }, [pose]);

  return (
    <div style={{
      width: '100%', maxWidth: 260, aspectRatio: '1 / 1',
      background: '#F2EAD8', // Papier-Hintergrund matcht die Bilder
      borderRadius: theme.radiusLg,
      border: `1px solid ${theme.border}`,
      overflow: 'hidden', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {pose && !imgFailed && (
        <img
          src={`poses/${pose}.jpg`}
          alt=""
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Anleitung - aufklappbar: Setup, Schritte, Tipp, Fehler
// ─────────────────────────────────────────────────────────────
function MobilityInstructions({ theme, ex, open, onToggle }) {
  return (
    <div style={{
      borderRadius: theme.radius,
      border: `1px solid ${open ? theme.borderStrong : theme.border}`,
      background: theme.surface2, overflow: 'hidden',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '12px 14px',
        background: 'transparent', border: 'none', color: theme.text,
        fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accent2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z"/><path d="M4 4.5A2.5 2.5 0 0 0 6.5 7H20"/></svg>
          Anleitung
        </span>
        <span style={{ color: theme.muted, fontSize: 18, lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${theme.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ex.setup && (
            <div>
              <Label theme={theme} style={{ marginBottom: 6 }}>Setup</Label>
              <div style={{ fontSize: 13, color: theme.mutedStrong, lineHeight: 1.6 }}>{ex.setup}</div>
            </div>
          )}
          {ex.steps && ex.steps.length > 0 && (
            <div>
              <Label theme={theme} style={{ marginBottom: 6 }}>Schritte</Label>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: theme.mutedStrong, lineHeight: 1.7 }}>
                {ex.steps.map((s, i) => <li key={i} style={{ marginBottom: 3 }}>{s}</li>)}
              </ol>
            </div>
          )}
          {ex.tip && (
            <div style={{
              padding: '10px 12px', borderRadius: theme.radius,
              background: theme.accent2 + '15', border: `1px solid ${theme.accent2}40`,
              fontSize: 12.5, color: theme.text, lineHeight: 1.55,
            }}>
              <strong style={{ color: theme.accent2, display: 'inline-flex', alignItems: 'center', gap: 6, verticalAlign: 'middle' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/></svg>
                Tipp:
              </strong> {ex.tip}
            </div>
          )}
          {ex.mistakes && ex.mistakes.length > 0 && (
            <div>
              <Label theme={theme} style={{ marginBottom: 6, color: theme.danger }}>Häufige Fehler</Label>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: theme.mutedStrong, lineHeight: 1.7 }}>
                {ex.mistakes.map((m, i) => <li key={i} style={{ marginBottom: 3 }}>{m}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MOBILITY SCREEN
// ─────────────────────────────────────────────────────────────
function MobilityScreen({ theme, state, setState, onClose }) {
  // Aktive Session in localStorage spiegeln, damit ein versehentlicher Reload
  // mitten in einer Mobility-Session nicht den Fortschritt verliert.
  const activeMobKey = 'ft.activeMobility';
  function loadActiveMob() {
    try { return JSON.parse(localStorage.getItem(activeMobKey) || 'null'); }
    catch { return null; }
  }
  function clearActiveMob() {
    try { localStorage.removeItem(activeMobKey); } catch {}
  }
  // Nur wiederherstellen, wenn die Routine noch existiert.
  const savedMob = (() => {
    const s = loadActiveMob();
    if (s && s.routineId && FT.getMobilityRoutine(s.routineId)) return s;
    return null;
  })();

  const [routineId, setRoutineId] = useStateMob(savedMob ? savedMob.routineId : null);
  const [stepIdx, setStepIdx] = useStateMob(savedMob ? (savedMob.stepIdx || 0) : 0);
  const [doneView, setDoneView] = useStateMob(false);
  const [showInfo, setShowInfo] = useStateMob(false);
  const [now, setNow] = useStateMob(Date.now());
  const startedRef = useRefMob(Date.now());
  const bellPlayedRef = useRefMob(false);
  const sessionStartRef = useRefMob(savedMob && savedMob.sessionStart ? savedMob.sessionStart : 0);

  const routine = routineId ? FT.getMobilityRoutine(routineId) : null;
  const exs = routine ? routine.exercises : [];
  const ex = routine ? exs[stepIdx] : null;

  // Tick-Interval (nur während aktiver Session)
  useEffectMob(() => {
    if (!routine || doneView) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [routineId, doneView]);

  // Timer pro Schritt zurücksetzen + Anleitung wieder zuklappen
  useEffectMob(() => {
    startedRef.current = Date.now();
    bellPlayedRef.current = false;
    setNow(Date.now());
    setShowInfo(false);
  }, [stepIdx, routineId]);

  // Bell am Ende einer getimten Übung
  useEffectMob(() => {
    if (!ex || !ex.dur || doneView) return;
    const remaining = Math.max(0, ex.dur - (now - startedRef.current) / 1000);
    if (remaining <= 0 && !bellPlayedRef.current) {
      bellPlayedRef.current = true;
      FT.playSound(state.settings.soundKind, state.settings);
    }
  }, [now, ex, doneView, state.settings]);

  // Aktiven {routineId, stepIdx} spiegeln, solange eine Session läuft (nicht im Done-View).
  useEffectMob(() => {
    if (routineId && !doneView) {
      try {
        localStorage.setItem(activeMobKey, JSON.stringify({
          routineId, stepIdx, sessionStart: sessionStartRef.current,
        }));
      } catch (e) { console.warn('active mobility save failed', e); }
    } else {
      clearActiveMob();
    }
  }, [routineId, stepIdx, doneView]);

  function startRoutine(id) {
    setRoutineId(id);
    setStepIdx(0);
    setDoneView(false);
    setShowInfo(false);
    sessionStartRef.current = Date.now();
  }

  function next() {
    if (stepIdx + 1 < exs.length) {
      setStepIdx(stepIdx + 1);
      FT.playClick();
    } else {
      finish();
    }
  }

  function prev() {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
      FT.playClick();
    }
  }

  function finish() {
    const durationSec = Math.round((Date.now() - sessionStartRef.current) / 1000);
    setState(s => ({
      ...s,
      mobility: [...(Array.isArray(s.mobility) ? s.mobility : []), {
        date: FT.todayISO(), routineId, durationSec, completed: true,
      }],
    }));
    setDoneView(true);
  }

  function abort() {
    // Bei laufendem Fortschritt kurz rückfragen, sonst direkt abbrechen.
    if (stepIdx > 0 && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (!window.confirm('Session abbrechen? Der Fortschritt geht verloren.')) return;
    }
    clearActiveMob();
    setRoutineId(null);
    setStepIdx(0);
    setDoneView(false);
  }

  const wrapStyle = {
    height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    paddingTop: theme.padTop || 56, paddingBottom: `calc(30px + ${theme.padBot || '0px'})`,
  };

  // ── Bestätigung nach dem Abschluss ──────────────────────────
  if (doneView && routine) {
    return (
      <div style={wrapStyle}>
        <div style={{ padding: '12px 22px 14px', display: 'flex', justifyContent: 'flex-end' }}>
          <Pill theme={theme} fill>Mobility</Pill>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={theme.accent2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>
          <Heading theme={theme} size="xl" style={{ color: theme.text }}>Stark gemacht.</Heading>
          <div style={{ color: theme.muted, fontSize: 14 }}>
            {routine.name} · {exs.length} Übungen abgeschlossen
          </div>
          <div style={{ width: '100%', marginTop: 10 }}>
            <Btn theme={theme} kind="primary" full onClick={onClose}>Fertig</Btn>
          </div>
          <button onClick={() => startRoutine(routineId)} style={{
            background: 'transparent', border: 'none', color: theme.muted,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
            minHeight: 44, padding: '10px 8px',
          }}>Nochmal</button>
        </div>
      </div>
    );
  }

  // ── Aktive Session ──────────────────────────────────────────
  if (routine && ex) {
    const elapsed = (now - startedRef.current) / 1000;
    const remaining = ex.dur ? Math.max(0, ex.dur - elapsed) : 0;
    const pct = ex.dur ? Math.max(0, Math.min(1, elapsed / ex.dur)) : 0;
    const overdue = ex.dur && remaining <= 0;
    const sideLabel = ex.side === 'left' ? 'Links' : ex.side === 'right' ? 'Rechts' : null;

    const r = 88, cx = 120, cy = 120, circ = 2 * Math.PI * r;
    const dashOffset = circ * (1 - pct);

    return (
      <div style={wrapStyle}>
        {/* Top bar */}
        <div style={{ padding: '12px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={abort} style={{
            background: 'transparent', border: 'none', color: theme.muted,
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            minHeight: 44, padding: '10px 8px', marginLeft: -8, fontFamily: 'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Abbrechen
          </button>
          <span style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
            Übung {stepIdx + 1}/{exs.length}
          </span>
        </div>

        <div style={{ padding: '4px 22px 12px' }}>
          <Heading theme={theme} size="sm" style={{ color: theme.muted }}>{routine.name}</Heading>
        </div>

        {/* Pose + Name + Side */}
        <div style={{ padding: '0 22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <MobilityPose theme={theme} pose={ex.pose} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Heading theme={theme} size="md" style={{ color: theme.text, fontSize: 22, textAlign: 'center' }}>{ex.name}</Heading>
            {sideLabel && <Pill theme={theme} color={theme.accent2}>{sideLabel}</Pill>}
          </div>
        </div>

        {/* Timer oder Reps */}
        <div style={{ padding: '0 22px 16px', display: 'flex', justifyContent: 'center' }}>
          {ex.dur ? (
            <div style={{ position: 'relative', width: 240, height: 240 }}>
              <svg width="240" height="240" viewBox="0 0 240 240">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.surface2} strokeWidth="12" />
                <circle cx={cx} cy={cy} r={r} fill="none"
                  stroke={overdue ? theme.success : theme.accent2} strokeWidth="12"
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
                  fontSize: 48, fontWeight: 800, fontFamily: theme.fontDisplay,
                  color: overdue ? theme.success : theme.text,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
                }}>
                  {overdue ? 'FERTIG' : FT.fmtTime(remaining)}
                </div>
                {!overdue && (
                  <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: -2 }}>
                    von {FT.fmtTime(ex.dur)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              fontSize: 56, fontWeight: 800, fontFamily: theme.fontDisplay,
              color: theme.text, padding: '20px 0',
            }}>
              {ex.reps} <span style={{ fontSize: 18, color: theme.muted, fontFamily: theme.fontUI }}>Wdh</span>
            </div>
          )}
        </div>

        {/* Anleitung (aufklappbar) */}
        <div style={{ padding: '0 22px 14px' }}>
          <MobilityInstructions theme={theme} ex={ex} open={showInfo} onToggle={() => setShowInfo(v => !v)} />
        </div>

        {/* Steuerung */}
        <div style={{ padding: '0 22px 12px', display: 'flex', gap: 10 }}>
          <button onClick={prev} disabled={stepIdx === 0} aria-label="Vorherige Übung" style={{
            flex: '0 0 auto', minWidth: 44, minHeight: 44, padding: '14px',
            borderRadius: theme.radius,
            background: theme.surface2, border: `1px solid ${theme.border}`,
            color: stepIdx === 0 ? theme.muted : theme.text,
            opacity: stepIdx === 0 ? 0.4 : 1,
            cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform .08s, opacity .15s', fontFamily: 'inherit',
          }}
            onMouseDown={e => { if (stepIdx !== 0) e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => e.currentTarget.style.transform = ''}
            onMouseLeave={e => e.currentTarget.style.transform = ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div style={{ flex: 1 }}>
            <Btn theme={theme} kind="primary" full onClick={next}>
              {stepIdx + 1 < exs.length ? 'Weiter →' : '✓ Fertig'}
            </Btn>
          </div>
        </div>

        {/* Nächste Übung Vorschau */}
        {stepIdx + 1 < exs.length && (
          <div style={{ padding: '0 22px 20px' }}>
            <span style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
              Als Nächstes: <strong style={{ color: theme.mutedStrong }}>{exs[stepIdx + 1].name}</strong>
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── Routinen-Auswahl ────────────────────────────────────────
  const routines = FT.listMobilityRoutines();
  const recent = (Array.isArray(state.mobility) ? state.mobility : []).slice(-3).reverse();

  return (
    <div style={wrapStyle}>
      <div style={{ padding: '12px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: theme.muted,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit', minHeight: 44, padding: '10px 8px', marginLeft: -8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Zurück
        </button>
        <Pill theme={theme} fill>Mobility</Pill>
      </div>

      <div style={{ padding: '0 22px 6px' }}>
        <Heading theme={theme} size="xl" style={{ color: theme.text }}>Mobility</Heading>
        <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>
          Beweglichkeit · separat vom Krafttraining
        </div>
      </div>

      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {routines.map(r => (
          <Card key={r.id} theme={theme} style={{ padding: 16 }} onClick={() => startRoutine(r.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: 3 }}>
                  {r.focus} · {r.exercises.length} Übungen · ~{r.est} min
                </div>
              </div>
              <span style={{ color: theme.accent, fontSize: 18 }}>→</span>
            </div>
          </Card>
        ))}
      </div>

      {recent.length > 0 && (
        <div style={{ padding: '22px 22px 0' }}>
          <Label theme={theme} style={{ marginBottom: 8 }}>Zuletzt</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.map((m, i) => {
              const rt = FT.getMobilityRoutine(m.routineId);
              return (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: theme.radius,
                  background: theme.surface2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{rt ? rt.name : m.routineId}</span>
                  <span style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
                    {FT.daysAgo(m.date)} · {FT.fmtTime(m.durationSec || 0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

window.MobilityScreen = MobilityScreen;
