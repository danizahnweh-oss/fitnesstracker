/* global React, FT */
// app-coach.jsx - Coach screen: Claude feedback, Form-Cues, Custom Übungen, Replace

const { useState: useStateC, useEffect: useEffectC } = React;

const COACH_TAB_KEY = 'ft.coach.tab';
const COACH_TABS = [
  {
    id: 'feedback', label: 'KI',
    icon: <path d="M12 8V4M9 4h6M5 10h14a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a1 1 0 0 1 1-1zM9 14h.01M15 14h.01" />,
  },
  {
    id: 'video', label: 'Video',
    icon: <path d="M3 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM15 10l6-3v10l-6-3" />,
  },
  {
    id: 'cues', label: 'Form',
    icon: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 12v.01M12 8v4" />,
  },
  {
    id: 'custom', label: 'Übung',
    icon: <path d="M12 5v14M5 12h14" />,
  },
];

function CoachScreen({ theme, state, setState, onClose }) {
  const [tab, setTab] = useStateC(() => {
    try {
      const saved = localStorage.getItem(COACH_TAB_KEY);
      if (saved && COACH_TABS.some(t => t.id === saved)) return saved;
    } catch (e) { /* localStorage unavailable */ }
    return 'feedback';
  }); // feedback | cues | custom

  useEffectC(() => {
    try { localStorage.setItem(COACH_TAB_KEY, tab); } catch (e) { /* ignore */ }
  }, [tab]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: theme.padTop || 56, paddingBottom: `calc(30px + ${theme.padBot || '0px'})` }}>
      <div style={{ padding: '12px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: theme.muted,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit', minHeight: 44, minWidth: 44, padding: '10px 12px',
          marginLeft: -12,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Zurück
        </button>
        <Pill theme={theme} fill>Coach</Pill>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <Heading theme={theme} size="xl" style={{ color: theme.text }}>Coach</Heading>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 22px 14px', display: 'flex', gap: 4 }}>
        {COACH_TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} aria-pressed={active} style={{
              flex: 1, minHeight: 44, padding: '14px 0', borderRadius: theme.radius,
              background: active ? theme.surface : 'transparent',
              color: active ? theme.accent2 : theme.muted,
              border: `1px solid ${active ? theme.borderStrong : 'transparent'}`,
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'feedback' && <FeedbackTab theme={theme} state={state} />}
      {tab === 'video'    && <VideoTab    theme={theme} state={state} setState={setState} />}
      {tab === 'cues'     && <CuesTab     theme={theme} />}
      {tab === 'custom'   && <CustomTab   theme={theme} state={state} setState={setState} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FEEDBACK TAB - Claude-powered weekly analysis
// ─────────────────────────────────────────────────────────────
function FeedbackTab({ theme, state }) {
  const [loading, setLoading] = useStateC(false);
  const [response, setResponse] = useStateC('');
  const [error, setError] = useStateC('');

  async function generate() {
    setLoading(true); setError(''); setResponse('');
    const recent = state.sessions.slice(-6);
    if (!recent.length) {
      setError('Noch keine Sessions. Trainier ein paar Mal - dann kann der Coach was sagen.');
      setLoading(false);
      return;
    }
    const summary = recent.map(s => {
      const exes = (s.exercises || []).map(e => {
        const reps = (e.sets || []).map(st => `${st.reps}@RPE${st.rpe || '-'}`).join('/');
        return `${e.name}: ${e.weight}kg ${reps}`;
      }).join('; ');
      return `${s.date} [${s.sessionId}] feel=${s.feel || '-'}/5: ${exes}`;
    }).join('\n');

    const prompt = `Du bist ein erfahrener, lockerer Krafttrainer.
Hier sind die letzten Trainingseinheiten:

${summary}

Aktuelles Bodyweight: ${state.bodyweight[state.bodyweight.length - 1]?.kg ?? 'unbekannt'} kg
Woche im Plan: ${state.weekNo}
Trainingsplan: Restart-Phase Linear Progression, 3× / Woche (Mo/Mi/Fr).

Gib mir in 4-5 kurzen Absätzen lockeres, ehrliches Feedback auf Deutsch:
- Was läuft gut?
- Wo steckt's fest und warum?
- 1-2 konkrete Vorschläge für nächste Woche
- Ein motivierender Abschluss-Satz

Keine generischen Phrasen. Konkret und kurz.`;

    try {
      if (!window.claude?.complete) {
        throw new Error('claude_unavailable');
      }
      const text = await window.claude.complete(prompt);
      setResponse(text || 'Coach hat gerade nichts gesagt.');
    } catch (e) {
      setError("Coach ist gerade nicht erreichbar. Versuch's gleich nochmal.");
      console.error(e);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '0 22px' }}>
      <Card theme={theme} style={{ padding: 16 }}>
        <Label theme={theme}>KI-Coach</Label>
        <div style={{ marginTop: 6, fontSize: 13, color: theme.mutedStrong, lineHeight: 1.5 }}>
          Hol dir ein lockeres Feedback zu deinen letzten 6 Sessions:
          was läuft, wo's stockt, was du nächste Woche probieren solltest.
        </div>
        <div style={{ height: 14 }} />
        <Btn theme={theme} kind="primary" full onClick={generate} disabled={loading}>
          {loading ? 'Coach denkt nach …' : 'Feedback generieren'}
        </Btn>
      </Card>

      {error && (
        <div style={{
          marginTop: 12, padding: 14, borderRadius: theme.radius,
          background: theme.danger + '15', color: theme.danger,
          border: `1px solid ${theme.danger}40`, fontSize: 12,
        }}>{error}</div>
      )}

      {response && (
        <div style={{
          marginTop: 14, padding: 18, borderRadius: theme.radiusLg,
          background: theme.surface, border: `1px solid ${theme.border}`,
          fontSize: 13.5, lineHeight: 1.7, color: theme.text, whiteSpace: 'pre-wrap',
        }}>{response}</div>
      )}

      <div style={{
        marginTop: 14, padding: 12, borderRadius: theme.radius,
        background: theme.surface2, fontSize: 10, color: theme.muted,
        fontFamily: theme.fontMono, lineHeight: 1.5,
        display: 'flex', gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
        <span>Coach-Antworten basieren auf einem KI-Modell.
        Bei Verletzungen / Schmerzen immer mit echtem Arzt / Physio reden.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CUES TAB - form cues for each plan exercise
// ─────────────────────────────────────────────────────────────
function CuesTab({ theme }) {
  const allEx = [];
  Object.values(FT.TRAINING_PLAN).forEach(sess => {
    sess.exercises.forEach(ex => {
      if (!allEx.find(x => x.id === ex.id)) allEx.push(ex);
    });
  });

  const [open, setOpen] = useStateC(allEx[0]?.id);

  return (
    <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {allEx.map(ex => {
        const cues = FT.getCues(ex.id);
        if (!cues) return null;
        const isOpen = open === ex.id;
        return (
          <div key={ex.id} style={{
            background: theme.surface, borderRadius: theme.radius,
            border: `1px solid ${isOpen ? theme.borderStrong : theme.border}`,
            overflow: 'hidden',
          }}>
            <button onClick={() => setOpen(isOpen ? null : ex.id)} style={{
              width: '100%', padding: '14px 16px',
              background: 'transparent', border: 'none', color: theme.text,
              fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>{ex.name}</span>
              <span style={{ color: theme.muted, fontSize: 18, lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
                <Label theme={theme} style={{ marginBottom: 6 }}>Setup</Label>
                <div style={{ fontSize: 13, color: theme.mutedStrong, lineHeight: 1.6, marginBottom: 12 }}>
                  {cues.setup}
                </div>
                <Label theme={theme} style={{ marginBottom: 6 }}>Cues</Label>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: theme.mutedStrong, lineHeight: 1.7, marginBottom: 12 }}>
                  {cues.cues.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
                <Label theme={theme} style={{ marginBottom: 6, color: theme.danger }}>Häufige Fehler</Label>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: theme.mutedStrong, lineHeight: 1.7 }}>
                  {cues.mistakes.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CUSTOM TAB - add custom exercises, manage replacements
// ─────────────────────────────────────────────────────────────
function CustomTab({ theme, state, setState }) {
  const customs = state.customExercises || [];
  const [adding, setAdding] = useStateC(false);

  function addCustom(ex) {
    setState(s => ({
      ...s, customExercises: [...(s.customExercises || []), ex]
    }));
    setAdding(false);
  }

  function deleteCustom(id) {
    setState(s => ({
      ...s,
      customExercises: (s.customExercises || []).filter(c => c.id !== id),
      replacements: Object.fromEntries(Object.entries(s.replacements || {}).filter(([, v]) => v !== id)),
    }));
  }

  return (
    <div style={{ padding: '0 22px' }}>
      {adding && <CustomForm theme={theme} onAdd={addCustom} onCancel={() => setAdding(false)} />}

      {!adding && (
        <>
          <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Label theme={theme}>Eigene Übungen ({customs.length})</Label>
            <button onClick={() => setAdding(true)} style={{
              minHeight: 44, padding: '10px 14px', borderRadius: theme.radius,
              background: theme.accent, color: theme.accentText,
              border: 'none', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>+ Neue Übung</button>
          </div>

          {customs.length === 0 ? (
            <div style={{
              padding: 18, borderRadius: theme.radius,
              background: theme.surface, border: `1px dashed ${theme.border}`,
              fontSize: 12, color: theme.muted, textAlign: 'center',
            }}>
              Noch keine eigenen Übungen.<br />
              Tippe „+ Neue Übung" - z.B. Klimmzüge, Dips, Hammer Curls.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {customs.map(c => (
                <div key={c.id} style={{
                  padding: 14, borderRadius: theme.radius,
                  background: theme.surface, border: `1px solid ${theme.border}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: 2 }}>
                        {c.sets}×{c.reps} · {c.weight}kg · Pause {c.restRange} · +{c.increment}kg
                      </div>
                    </div>
                    <button onClick={() => deleteCustom(c.id)} style={{
                      background: 'transparent', color: theme.danger,
                      border: `1px solid ${theme.danger}40`, borderRadius: theme.radius,
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      minHeight: 44, minWidth: 44, padding: '10px 12px',
                      alignSelf: 'flex-start',
                    }}>Löschen</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Replacements info */}
          <div style={{
            marginTop: 18, padding: 12, borderRadius: theme.radius,
            background: theme.surface2, fontSize: 11, color: theme.muted, lineHeight: 1.6,
          }}>
            <strong style={{ color: theme.mutedStrong }}>Ersetzen:</strong> Im Workout-Screen kannst du eine
            Plan-Übung durch eine eigene austauschen (z.B. wenn die Bank besetzt ist).
          </div>
        </>
      )}
    </div>
  );
}

function CustomForm({ theme, onAdd, onCancel }) {
  const [name, setName] = useStateC('');
  const [sets, setSets] = useStateC(3);
  const [reps, setReps] = useStateC(10);
  const [weight, setWeight] = useStateC(20);
  const [rest, setRest] = useStateC(90);
  const [type, setType] = useStateC('compound');

  function submit() {
    if (!name.trim()) return;
    onAdd({
      id: 'c_' + Date.now(),
      name: name.trim(),
      warmups: [],
      sets, reps, weight,
      rest, restRange: rest < 90 ? `${rest}s` : `${Math.round(rest / 60)} min`,
      type, increment: type === 'isolation' ? 1.25 : 2.5, bar: type === 'compound' ? 20 : 0,
      custom: true,
    });
  }

  return (
    <div style={{
      padding: 14, borderRadius: theme.radius,
      background: theme.surface, border: `1px solid ${theme.borderStrong}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Neue Übung</div>
        <button type="button" onClick={onCancel} style={{
          background: 'transparent', border: 'none', color: theme.muted,
          fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
          minHeight: 44, minWidth: 44, padding: '10px 12px', marginRight: -12,
        }}>Abbrechen</button>
      </div>

      <Label theme={theme} htmlFor="custom-ex-name" style={{ marginBottom: 4 }}>Name</Label>
      <input id="custom-ex-name" name="customExerciseName" value={name} onChange={e => setName(e.target.value)}
        placeholder="z.B. Klimmzüge"
        style={inputStyle(theme)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
        <NumField theme={theme} id="custom-ex-sets" label="Sätze" value={sets} onChange={setSets} />
        <NumField theme={theme} id="custom-ex-reps" label="Wdh" value={reps} onChange={setReps} />
        <NumField theme={theme} id="custom-ex-weight" label="Gewicht" value={weight} onChange={setWeight} step={2.5} unit="kg" />
      </div>

      <div style={{ marginTop: 10 }}>
        <Label theme={theme} style={{ marginBottom: 4 }}>Typ</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['compound', 'Compound +2.5 kg'], ['isolation', 'Isolation +1.25 kg']].map(([k, l]) => (
            <button key={k} type="button" aria-pressed={type === k} onClick={() => setType(k)} style={{
              flex: 1, minHeight: 44, padding: '12px 8px', borderRadius: theme.radius,
              background: type === k ? theme.accent + '22' : theme.surface2,
              color: type === k ? theme.accent : theme.text,
              border: `1px solid ${type === k ? theme.accent : theme.border}`,
              fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <Label theme={theme} htmlFor="custom-ex-rest" style={{ marginBottom: 4 }}>Pause (Sekunden)</Label>
        <input id="custom-ex-rest" name="customExerciseRest" type="number" min="0" step="5" inputMode="numeric"
          value={rest} onChange={e => setRest(parseInt(e.target.value) || 60)}
          style={inputStyle(theme)} />
      </div>

      <div style={{ height: 14 }} />
      <Btn theme={theme} kind="primary" full onClick={submit} disabled={!name.trim()}>
        Hinzufügen
      </Btn>
    </div>
  );
}

function NumField({ theme, id, label, value, onChange, step = 1, unit }) {
  return (
    <div>
      <Label theme={theme} htmlFor={id} style={{ marginBottom: 4 }}>{label}{unit ? ` (${unit})` : ''}</Label>
      <input id={id} name={id} type="number" min="0" step={step} inputMode="decimal" value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={inputStyle(theme)} />
    </div>
  );
}

function inputStyle(theme) {
  return {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', borderRadius: theme.radius,
    background: theme.bg, border: `1px solid ${theme.border}`,
    color: theme.text, fontSize: 16, fontFamily: 'inherit', outline: 'none',
  };
}

window.CoachScreen = CoachScreen;
