/* global React, FT */
// app-mobility.jsx — Mobility-Sessions (Beweglichkeit, getrennt vom Krafttraining)
//
// View 1: Routinen-Auswahl + kurze Historie.
// View 2: Aktive Session — pro Übung ein Countdown (oder Wdh), Bell am Ende,
//         "Weiter" bis "Fertig". Speichert {date, routineId, durationSec, completed}.

const { useState: useStateMob, useEffect: useEffectMob, useRef: useRefMob } = React;

function MobilityScreen({ theme, state, setState, onClose }) {
  const [routineId, setRoutineId] = useStateMob(null);
  const [stepIdx, setStepIdx] = useStateMob(0);
  const [doneView, setDoneView] = useStateMob(false);
  const [now, setNow] = useStateMob(Date.now());
  const startedRef = useRefMob(Date.now());
  const bellPlayedRef = useRefMob(false);
  const sessionStartRef = useRefMob(0);

  const routine = routineId ? FT.getMobilityRoutine(routineId) : null;
  const exs = routine ? routine.exercises : [];
  const ex = routine ? exs[stepIdx] : null;

  // Ein Tick-Interval, nur während einer aktiven Session
  useEffectMob(() => {
    if (!routine || doneView) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [routineId, doneView]);

  // Timer pro Schritt zurücksetzen
  useEffectMob(() => {
    startedRef.current = Date.now();
    bellPlayedRef.current = false;
    setNow(Date.now());
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

  function startRoutine(id) {
    setRoutineId(id);
    setStepIdx(0);
    setDoneView(false);
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
          <div style={{ fontSize: 52 }}>🧘</div>
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

    const r = 100, cx = 120, cy = 120, circ = 2 * Math.PI * r;
    const dashOffset = circ * (1 - pct);

    return (
      <div style={wrapStyle}>
        {/* Top bar */}
        <div style={{ padding: '12px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={abort} style={{
            background: 'transparent', border: 'none', color: theme.muted,
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            padding: 0, fontFamily: 'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Abbrechen
          </button>
          <span style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
            Übung {stepIdx + 1}/{exs.length}
          </span>
        </div>

        <div style={{ padding: '4px 22px 12px' }}>
          <Heading theme={theme} size="lg" style={{ color: theme.text }}>{routine.name}</Heading>
        </div>

        {/* Aktuelle Übung */}
        <div style={{ padding: '0 22px' }}>
          <div style={{
            padding: 18, borderRadius: theme.radiusLg,
            background: theme.surface, border: `1px solid ${theme.borderStrong}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ fontSize: 19, fontWeight: 800, textAlign: 'center' }}>{ex.name}</div>
              {sideLabel && <Pill theme={theme} color={theme.accent2}>{sideLabel}</Pill>}
            </div>

            {ex.dur ? (
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
                fontSize: 48, fontWeight: 800, fontFamily: theme.fontDisplay,
                color: theme.text, padding: '20px 0',
              }}>
                {ex.reps} <span style={{ fontSize: 18, color: theme.muted, fontFamily: theme.fontUI }}>Wdh</span>
              </div>
            )}

            <div style={{ fontSize: 13, color: theme.mutedStrong, lineHeight: 1.6, textAlign: 'center' }}>
              {ex.desc}
            </div>
          </div>
        </div>

        {/* Steuerung */}
        <div style={{ padding: '14px 22px 20px' }}>
          <Btn theme={theme} kind="primary" full onClick={next}>
            {stepIdx + 1 < exs.length ? 'Weiter →' : '✓ Fertig'}
          </Btn>
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
          fontFamily: 'inherit', padding: 0,
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
