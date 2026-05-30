/* global React, FT */
// app-workout-card.jsx — ExerciseCard + SetRow + ReplacePicker
//
// Used by WorkoutScreen (app-workout.jsx). Manages the per-exercise UI:
// collapsed list row → active expanded "ready" state with weight adjust,
// warm-up display, set rows, and the giant "Satz fertig" button on the
// current set.

// ─────────────────────────────────────────────────────────────
// CUES BLOCK — aufklappbare Technik-Hinweise (Setup, Cues, Fehler)
// ─────────────────────────────────────────────────────────────
function CuesBlock({ theme, cues, open, onToggle }) {
  if (!cues) return null;
  return (
    <div style={{
      marginTop: 12, borderRadius: theme.radius,
      border: `1px solid ${open ? theme.borderStrong : theme.border}`,
      overflow: 'hidden', background: theme.surface2,
    }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '12px 14px',
        background: 'transparent', border: 'none', color: theme.text,
        fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>Technik & Fehler</span>
        <span style={{ color: theme.muted, fontSize: 18, lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
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
}

// ─────────────────────────────────────────────────────────────
// EXERCISE CARD — collapsed list, active = expanded ready-state
// ─────────────────────────────────────────────────────────────
function ExerciseCard({ theme, state, ex, live, active, done, warmupStyle, onTap, onStartSet, onAdjustWeight, onOpenPlates, onReplace }) {
  const last = FT.findLastForExercise(state, ex.id);
  const change = last ? live.weight - (last.weight || live.weight) : 0;
  const warmups = FT.generateWarmupsBy(warmupStyle, ex, live.weight);

  const isStuck = last && FT.detectStall(state, FT.SESSION_DOW[1], ex.id);
  const currentSetIdx = live.sets.findIndex(s => !s.done);

  const [showCues, setShowCues] = React.useState(false);
  const cues = FT.getCues(ex.id); // null bei Custom-/ersetzten Übungen

  return (
    <div style={{
      background: theme.surface,
      borderRadius: theme.radiusLg,
      border: `1px solid ${active ? theme.borderStrong : theme.border}`,
      boxShadow: active ? `0 0 0 1px ${theme.accent}30, ${theme.cardShadow}` : theme.cardShadow,
      transition: 'box-shadow .2s, border-color .2s',
      overflow: 'hidden',
    }}>
      <div onClick={onTap} style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {done && (
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: theme.success,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: theme.accentText, flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
            )}
            <div style={{ fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ex.name}{ex.custom && <span style={{ color: theme.accent2, marginLeft: 6, fontSize: 11 }}>custom</span>}
            </div>
          </div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 3, fontFamily: theme.fontMono }}>
            {live.sets.filter(s => s.done).length}/{ex.sets} · Wdh {ex.reps} · Pause {ex.restRange}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: theme.fontDisplay, color: theme.text }}>
              {FT.fmtWeight(live.weight)}
            </div>
            <span style={{ fontSize: 11, color: theme.muted }}>kg</span>
          </div>
          {change > 0 && <div style={{ fontSize: 10, color: theme.success, fontWeight: 700 }}>+{FT.fmtWeight(change)}↑</div>}
          {change < 0 && <div style={{ fontSize: 10, color: theme.danger, fontWeight: 700 }}>{FT.fmtWeight(change)}↓</div>}
        </div>
      </div>

      {active && !done && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: '14px 16px' }}>

          {/* Stall hint → Deload suggestion */}
          {isStuck && (
            <div style={{
              padding: '10px 12px', marginBottom: 12,
              borderRadius: theme.radius, background: theme.accent2 + '15',
              border: `1px solid ${theme.accent2}40`,
              fontSize: 11, color: theme.text, lineHeight: 1.5,
            }}>
              <strong style={{ color: theme.accent2 }}>⚠ Festgefahren</strong> — 2 Sessions auf {FT.fmtWeight(live.weight)}kg.
              Versuch <strong>Deload</strong>: nimm diese Session −10% und arbeite dich nächste Woche wieder hoch.
              <div style={{ marginTop: 6 }}>
                <button onClick={() => onAdjustWeight(-Math.round(live.weight * 0.1 / 2.5) * 2.5)} style={{
                  padding: '6px 10px', borderRadius: theme.radius,
                  background: theme.accent2, color: theme.accentText, border: 'none',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>Deload anwenden</button>
              </div>
            </div>
          )}

          {/* Weight adjust + plate + replace */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 6 }}>
            <Label theme={theme}>Arbeitsgewicht</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StepBtn theme={theme} onClick={() => onAdjustWeight(-ex.increment)}>−{FT.fmtWeight(ex.increment)}</StepBtn>
              <StepBtn theme={theme} onClick={() => onAdjustWeight(ex.increment)}>+{FT.fmtWeight(ex.increment)}</StepBtn>
              {ex.type === 'compound' && (
                <button onClick={onOpenPlates} title="Plate Calc" style={{
                  width: 36, height: 32, borderRadius: theme.radius,
                  background: theme.surface2, border: `1px solid ${theme.border}`,
                  color: theme.text, fontSize: 14, cursor: 'pointer',
                  fontFamily: theme.fontMono, fontWeight: 700,
                }}>⏤⏤</button>
              )}
              <button onClick={onReplace} title="Übung ersetzen" style={{
                width: 32, height: 32, borderRadius: theme.radius,
                background: theme.surface2, border: `1px solid ${theme.border}`,
                color: theme.muted, fontSize: 16, cursor: 'pointer', lineHeight: 1,
              }}>⇄</button>
            </div>
          </div>

          {/* Warm-ups */}
          {warmups.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <Label theme={theme} style={{ marginBottom: 6 }}>
                Aufwärmen ({warmupStyle === 'wendler' ? 'Wendler-Style' : 'Standard'})
              </Label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {warmups.map((w, i) => (
                  <div key={i} style={{
                    padding: '6px 10px', background: theme.surface2,
                    borderRadius: theme.radius, fontSize: 11, fontFamily: theme.fontMono,
                    color: theme.mutedStrong,
                  }}>
                    {FT.fmtWeight(w.w)}{typeof w.w === 'number' ? 'kg' : ''} × {w.r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Set list with big "Satz fertig" button on current */}
          <Label theme={theme} style={{ marginBottom: 6 }}>Arbeitssätze</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {live.sets.map((s, i) => (
              <SetRow key={i} theme={theme} idx={i} set={s} targetReps={ex.reps}
                isCurrent={i === currentSetIdx}
                rpeMode={state.settings.rpeMode}
                onStart={() => onStartSet(i)}
              />
            ))}
          </div>

          {/* Last session compact */}
          {last && (
            <div style={{ marginTop: 12, padding: '8px 10px', borderRadius: theme.radius, background: theme.surface2 }}>
              <span style={{ fontSize: 10, color: theme.muted, fontFamily: theme.fontMono, letterSpacing: 1, textTransform: 'uppercase' }}>
                zuletzt {FT.daysAgo(last.date)} · {FT.fmtWeight(last.weight)}kg
              </span>
              <span style={{ marginLeft: 8, fontFamily: theme.fontMono, fontSize: 11, color: theme.mutedStrong }}>
                {last.sets.map(s => s.reps + (s.rpe ? `@${s.rpe}` : '')).join(' · ')}
              </span>
            </div>
          )}

          {/* Technik-Hinweise (aufklappbar) */}
          <CuesBlock theme={theme} cues={cues} open={showCues} onToggle={() => setShowCues(v => !v)} />
        </div>
      )}

      {/* Erledigte Übung — Performance dieser Session nachschauen */}
      {active && done && (
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: '14px 16px' }}>
          <Label theme={theme} style={{ marginBottom: 6 }}>Diese Session · {FT.fmtWeight(live.weight)}kg</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {live.sets.map((s, i) => (
              <SetRow key={i} theme={theme} idx={i} set={s} targetReps={ex.reps}
                isCurrent={false} rpeMode={state.settings.rpeMode} onStart={() => {}} />
            ))}
          </div>

          {/* Technik-Hinweise (aufklappbar) */}
          <CuesBlock theme={theme} cues={cues} open={showCues} onToggle={() => setShowCues(v => !v)} />
        </div>
      )}
    </div>
  );
}

function StepBtn({ theme, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      minWidth: 52, height: 32, padding: '0 8px', borderRadius: theme.radius,
      background: theme.surface2, border: `1px solid ${theme.border}`,
      color: theme.text, fontWeight: 700, fontSize: 12, fontFamily: theme.fontMono,
      cursor: 'pointer',
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// SET ROW — collapsed: ✓/○ summary; current: BIG "Satz fertig" button
// ─────────────────────────────────────────────────────────────
function SetRow({ theme, idx, set, targetReps, isCurrent, rpeMode, onStart }) {
  if (set.done) {
    return (
      <div style={{
        padding: '10px 12px', borderRadius: theme.radius,
        background: theme.surface2, opacity: 0.8,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: theme.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.accentText} strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Satz {idx + 1}</div>
        <div style={{ flex: 1, fontFamily: theme.fontMono, fontSize: 12, color: theme.mutedStrong }}>
          {set.reps} Wdh · {rpeMode === 'rir' && set.rpe ? `RIR ${FT.rpeToRir(set.rpe)}` : (set.rpe ? `RPE ${set.rpe}` : '')}
        </div>
        {set.form && set.form !== 'sauber' && (
          <span style={{ fontSize: 10, color: theme.accent2, fontFamily: theme.fontMono, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {set.form}
          </span>
        )}
        {set.note && <span style={{ fontSize: 11, color: theme.muted }} title={set.note}>✎</span>}
      </div>
    );
  }

  if (isCurrent) {
    return (
      <button onClick={onStart} style={{
        padding: '18px 16px', borderRadius: theme.radiusLg,
        background: theme.accent, color: theme.accentText,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: `0 8px 24px -8px ${theme.accent}80`,
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14, fontFamily: theme.fontDisplay,
        }}>{idx + 1}</div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: theme.upperHeads ? 0.5 : 0,
            textTransform: theme.upperHeads ? 'uppercase' : 'none' }}>
            Satz fertig
          </div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
            Ziel {targetReps} Wdh · Pause startet sofort
          </div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </button>
    );
  }

  // Future set — just placeholder
  return (
    <div style={{
      padding: '10px 12px', borderRadius: theme.radius,
      background: 'transparent', border: `1px dashed ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 10, opacity: 0.5,
    }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${theme.border}` }} />
      <div style={{ fontSize: 13, fontWeight: 700 }}>Satz {idx + 1}</div>
      <div style={{ flex: 1, fontFamily: theme.fontMono, fontSize: 12, color: theme.muted }}>
        Ziel {targetReps} Wdh
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REPLACE PICKER — pick a custom exercise to swap in
// ─────────────────────────────────────────────────────────────
function ReplacePicker({ theme, state, ex, onPick, onClose }) {
  const customs = state.customExercises || [];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn .2s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        marginTop: 'auto', padding: 22, paddingBottom: 36,
        background: theme.surface, borderRadius: `${theme.radiusXl}px ${theme.radiusXl}px 0 0`,
        borderTop: `1px solid ${theme.borderStrong}`,
      }}>
        <div style={{ width: 40, height: 4, background: theme.border, borderRadius: 2, margin: '0 auto 18px' }} />

        <Heading theme={theme} size="md">{ex.name} ersetzen</Heading>
        <div style={{ height: 14 }} />

        {customs.length === 0 ? (
          <div style={{
            padding: 16, borderRadius: theme.radius,
            background: theme.surface2, fontSize: 12, color: theme.muted, textAlign: 'center',
          }}>
            Keine eigenen Übungen.<br />Erstelle welche im Coach → ➕ Übungen.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {customs.map(c => (
              <button key={c.id} onClick={() => onPick(c.id)} style={{
                padding: '12px 14px', borderRadius: theme.radius,
                background: theme.surface2, border: `1px solid ${theme.border}`,
                color: theme.text, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: 2 }}>
                    {c.sets}×{c.reps} · {c.weight}kg
                  </div>
                </div>
                <span style={{ color: theme.accent, fontSize: 14 }}>→</span>
              </button>
            ))}
            <button onClick={() => onPick(null)} style={{
              marginTop: 6, padding: '10px 14px', borderRadius: theme.radius,
              background: 'transparent', border: `1px solid ${theme.danger}40`,
              color: theme.danger, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12,
            }}>Zurück zur Plan-Übung</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.ExerciseCard = ExerciseCard;
window.SetRow = SetRow;
window.ReplacePicker = ReplacePicker;
