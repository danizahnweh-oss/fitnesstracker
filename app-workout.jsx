/* global React, FT */
// app-workout.jsx — Workout flow orchestrator (REWORKED):
// • Pause-first: tap "Satz fertig" → rest timer starts immediately, log details DURING the pause
// • Big tap targets, inline plate calc, RIR/RPE switch, form-tag
// • Wake-lock while a workout is active
// • Replace exercise from custom list
//
// Card UI, rest timer overlay, and replace picker live in companion files:
//   app-workout-card.jsx  → ExerciseCard, SetRow, ReplacePicker
//   app-workout-rest.jsx  → RestTimerOverlay + RPE/RIR helpers

const { useState: useStateW, useEffect: useEffectW, useMemo: useMemoW } = React;

function WorkoutScreen({ theme, state, setState, sessionId, onExit, onComplete, onCelebrate, onOpenCoach }) {
  const session = FT.TRAINING_PLAN[sessionId];
  const exercises = useMemoW(() => FT.getSessionExercises(state, sessionId), [state, sessionId]);
  const lastSession = FT.findLastSession(state, sessionId);

  // Live working state
  const [live, setLive] = useStateW(() => exercises.map(ex => {
    const suggested = FT.suggestNextWeight(ex, lastSession);
    return {
      id: ex.id, weight: suggested,
      sets: Array.from({ length: ex.sets }, () => ({
        reps: null, rpe: null, form: 'sauber', note: '', done: false,
      })),
    };
  }));

  const [activeEx, setActiveEx] = useStateW(0);
  const [restState, setRestState] = useStateW(null);  // {exIdx, setIdx, duration, startedAt}
  const [summary, setSummary] = useStateW(null);
  const [showReplace, setShowReplace] = useStateW(null);  // exIdx or null
  const [inlinePlate, setInlinePlate] = useStateW(null); // {target, bar}

  // Wake Lock — keep screen on during a workout
  useEffectW(() => {
    if (state.settings.wakeLockEnabled) FT.requestWakeLock();
    return () => FT.releaseWakeLock();
  }, [state.settings.wakeLockEnabled]);

  const isSessionDone = useMemoW(() => live.every(l => l.sets.every(s => s.done)), [live]);

  // Tap "Satz fertig" → start rest IMMEDIATELY with defaults; log details during rest
  function startSetCompletion(exIdx, setIdx) {
    const ex = exercises[exIdx];
    // Defaults: target reps, RPE 7, form "sauber"
    setLive(prev => prev.map((l, i) => i !== exIdx ? l : {
      ...l,
      sets: l.sets.map((s, j) => j !== setIdx
        ? s : { reps: ex.reps, rpe: 7, form: 'sauber', note: '', done: true }),
    }));
    setRestState({
      exIdx, setIdx, duration: ex.rest, startedAt: Date.now(),
      nextLabel: nextSetLabel(exIdx, setIdx, exercises),
    });
    FT.playClick();
  }

  function updateCurrentSet(patch) {
    if (!restState) return;
    setLive(prev => prev.map((l, i) => i !== restState.exIdx ? l : {
      ...l,
      sets: l.sets.map((s, j) => j !== restState.setIdx ? s : { ...s, ...patch }),
    }));
  }

  function adjustWeight(exIdx, delta) {
    setLive(p => p.map((x, j) => j !== exIdx ? x : {
      ...x, weight: Math.max(0, Math.round((x.weight + delta) * 100) / 100),
    }));
  }

  // Auto-advance to first unfinished set's exercise
  useEffectW(() => {
    if (restState) return;
    for (let i = 0; i < live.length; i++) {
      const undone = live[i].sets.findIndex(s => !s.done);
      if (undone !== -1) { setActiveEx(i); return; }
    }
  }, [live, restState]);

  function nextSetLabel(exIdx, setIdx, exes) {
    if (setIdx + 1 < exes[exIdx].sets) {
      return `Satz ${setIdx + 2}/${exes[exIdx].sets} · ${FT.fmtWeight(live[exIdx].weight)}kg`;
    }
    if (exIdx + 1 < exes.length) return exes[exIdx + 1].name;
    return 'Session abschließen';
  }

  function finishSession() {
    const exercisesLog = live.map((l, i) => ({
      id: l.id,
      name: exercises[i].name,
      weight: l.weight,
      sets: l.sets.filter(s => s.done).map(s => ({
        reps: s.reps, rpe: s.rpe, form: s.form, note: s.note,
      })),
    })).filter(e => e.sets.length > 0);
    setSummary({ exercisesLog });
  }

  function saveSessionWithFeel(feel, notes, recovery) {
    const session_record = {
      date: FT.todayISO(),
      sessionId, week: state.weekNo,
      exercises: summary.exercisesLog,
      feel, notes, recovery: recovery || state.__pendingRecovery || null,
    };
    // PR detection
    const prs = FT.detectPRs(state, session_record);
    session_record.prs = prs;
    setState(s => ({
      ...s,
      sessions: [...s.sessions, session_record],
      currentSessionIdx: (s.currentSessionIdx + 1) % 3,
      __pendingRecovery: undefined,
    }));
    if (prs.length && onCelebrate) onCelebrate(prs);
    onComplete();
  }

  function applyReplacement(exIdx, customId) {
    const exId = exercises[exIdx].id;
    const key = `${sessionId}-${exId}`;
    setState(s => ({
      ...s,
      replacements: customId
        ? { ...(s.replacements || {}), [key]: customId }
        : Object.fromEntries(Object.entries(s.replacements || {}).filter(([k]) => k !== key)),
    }));
    setShowReplace(null);
  }

  if (summary) {
    return <SessionSummary theme={theme} session={session} exercises={exercises} summary={summary}
      lastSession={lastSession}
      onSave={saveSessionWithFeel} onCancel={() => setSummary(null)} />;
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: theme.padTop || 56, paddingBottom: `calc(20px + ${theme.padBot || '0px'})` }}>
      {/* Top bar */}
      <div style={{ padding: '12px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onExit} style={{
          background: 'transparent', border: 'none', color: theme.muted,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          padding: 0, fontFamily: 'inherit',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Beenden
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill theme={theme} color={theme.accent} fill style={{ fontSize: 11 }}>{session.id}</Pill>
          <span style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, alignSelf: 'center' }}>
            Woche {state.weekNo}
          </span>
        </div>
      </div>

      {/* Session title */}
      <div style={{ padding: '4px 22px 14px' }}>
        <Heading theme={theme} size="xl" style={{ color: theme.text, fontSize: 30 }}>
          {session.name}
        </Heading>
      </div>

      {/* Exercise list */}
      <div style={{ padding: '0 22px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {exercises.map((ex, i) => (
          <ExerciseCard key={ex.id + i} theme={theme} state={state} ex={ex} live={live[i]}
            active={i === activeEx} done={live[i].sets.every(s => s.done)}
            warmupStyle={state.settings.warmupStyle}
            onTap={() => setActiveEx(i)}
            onStartSet={(setIdx) => startSetCompletion(i, setIdx)}
            onAdjustWeight={(delta) => adjustWeight(i, delta)}
            onOpenPlates={() => setInlinePlate({ target: live[i].weight, bar: ex.bar || 20 })}
            onReplace={() => setShowReplace(i)}
          />
        ))}
      </div>

      {/* Finish */}
      <div style={{ padding: '8px 22px 20px' }}>
        <Btn theme={theme} kind={isSessionDone ? 'primary' : 'secondary'} full
          onClick={finishSession} disabled={!live.some(l => l.sets.some(s => s.done))}>
          {isSessionDone ? '✓ Session abschließen' : 'Frühzeitig beenden'}
        </Btn>
      </div>

      {/* REST + LOG OVERLAY */}
      {restState && (
        <RestTimerOverlay theme={theme}
          state={state}
          exercise={exercises[restState.exIdx]}
          setIdx={restState.setIdx}
          weight={live[restState.exIdx].weight}
          set={live[restState.exIdx].sets[restState.setIdx]}
          nextLabel={restState.nextLabel}
          duration={restState.duration}
          onUpdateSet={updateCurrentSet}
          onClose={() => setRestState(null)}
          onOpenPlates={() => setInlinePlate({ target: live[restState.exIdx].weight, bar: exercises[restState.exIdx].bar || 20 })}
        />
      )}

      {/* Inline plate calc */}
      {inlinePlate && (
        <PlateCalculator theme={theme} target={inlinePlate.target} bar={inlinePlate.bar}
          onClose={() => setInlinePlate(null)} />
      )}

      {/* Replace exercise picker */}
      {showReplace !== null && (
        <ReplacePicker theme={theme} state={state}
          ex={exercises[showReplace]}
          onPick={(customId) => applyReplacement(showReplace, customId)}
          onClose={() => setShowReplace(null)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SESSION SUMMARY
// ─────────────────────────────────────────────────────────────
function SessionSummary({ theme, session, exercises, summary, onSave, onCancel }) {
  const [feel, setFeel] = useStateW(4);
  const [notes, setNotes] = useStateW('');

  const totalVolume = summary.exercisesLog.reduce((vol, e) => {
    return vol + (e.sets || []).reduce((v, s) => v + (s.reps || 0) * (e.weight || 0), 0);
  }, 0);
  const totalSets = summary.exercisesLog.reduce((n, e) => n + (e.sets?.length || 0), 0);

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: theme.padTop || 56, paddingBottom: `calc(30px + ${theme.padBot || '0px'})` }}>
      <div style={{ padding: '20px 22px 6px' }}>
        <Pill theme={theme} color={theme.success} fill>Session fertig</Pill>
        <div style={{ height: 12 }} />
        <Heading theme={theme} size="xl" style={{ color: theme.text }}>Stark gemacht.</Heading>
        <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>
          {session.name} · {totalSets} Sätze · {Math.round(totalVolume).toLocaleString('de-DE')} kg Volumen
        </div>
      </div>

      <div style={{ padding: '20px 22px 0' }}>
        <Label theme={theme} style={{ marginBottom: 8 }}>Wie hat sich's angefühlt?</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setFeel(n)} style={{
              flex: 1, padding: '14px 0', borderRadius: theme.radius,
              background: feel >= n ? theme.accent : theme.surface,
              color: feel >= n ? theme.accentText : theme.muted,
              border: `1px solid ${feel >= n ? theme.accent : theme.border}`,
              fontSize: 18, cursor: 'pointer',
            }}>★</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: theme.muted, marginTop: 6, fontFamily: theme.fontMono }}>
          {['', 'mies', 'naja', 'okay', 'gut', 'top-form'][feel]}
        </div>
      </div>

      <div style={{ padding: '18px 22px 0' }}>
        <Label theme={theme} style={{ marginBottom: 6 }}>Tagebuch (optional)</Label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Schlaf? Energie? Stimmung?"
          style={{
            width: '100%', boxSizing: 'border-box', minHeight: 70,
            padding: 12, borderRadius: theme.radius, background: theme.surface,
            border: `1px solid ${theme.border}`, color: theme.text,
            fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none',
          }} />
      </div>

      <div style={{ padding: '18px 22px 0' }}>
        <Label theme={theme} style={{ marginBottom: 8 }}>Recap & nächste Session</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {summary.exercisesLog.map((e, i) => {
            const exDef = exercises[i] || e;
            const fakeLast = { exercises: [e] };
            const nextW = FT.suggestNextWeight(exDef, fakeLast);
            const change = nextW - e.weight;
            return (
              <div key={e.id} style={{
                padding: 12, borderRadius: theme.radius,
                background: theme.surface, border: `1px solid ${theme.border}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
                    {e.weight}kg · {e.sets.map(s => s.reps).join('/')}
                  </div>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, fontFamily: theme.fontMono,
                  color: change > 0 ? theme.success : theme.mutedStrong }}>
                  Nächste Session: <strong>{FT.fmtWeight(nextW)}kg</strong>
                  {change > 0 && ` · +${FT.fmtWeight(change)}kg ↑`}
                  {change === 0 && ` · halten`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: 22, display: 'flex', gap: 10 }}>
        <Btn theme={theme} kind="ghost" onClick={onCancel} style={{ flex: 1 }}>Zurück</Btn>
        <Btn theme={theme} kind="primary" onClick={() => onSave(feel, notes)} style={{ flex: 2 }}>
          Speichern
        </Btn>
      </div>
    </div>
  );
}

window.WorkoutScreen = WorkoutScreen;
