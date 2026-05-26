/* global React, ReactDOM */
// app.jsx — Main App component (themed). Single React tree per artboard.

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const FT = window.FT;

// ─────────────────────────────────────────────────────────────
// Hook: state + persistence
// ─────────────────────────────────────────────────────────────
function useAppState(theme) {
  const [state, setState] = useState(() =>
    FT.mergeDefaults(FT.loadState(theme.id))
  );
  useEffect(() => { FT.saveState(theme.id, state); }, [state, theme.id]);
  return [state, setState];
}

// ─────────────────────────────────────────────────────────────
// UI primitives — themed
// ─────────────────────────────────────────────────────────────
function Frame({ theme, children }) {
  const mobile = theme.isMobile;

  if (mobile) {
    return (
      <div style={{
        width: '100%', height: '100dvh', overflow: 'hidden',
        background: 'transparent', color: theme.text,
        fontFamily: theme.fontUI, fontWeight: theme.weightUi,
        position: 'relative',
        WebkitFontSmoothing: 'antialiased',
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      width: 390, height: 844, overflow: 'hidden',
      background: theme.bgGrad, color: theme.text,
      fontFamily: theme.fontUI, fontWeight: theme.weightUi,
      position: 'relative', borderRadius: 36,
      boxShadow: '0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 47, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', color: theme.text, fontSize: 15, fontWeight: 600,
        letterSpacing: -0.2,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', opacity: 0.85 }}>
          <Dots /><Wifi /><Battery />
        </div>
      </div>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 110, height: 32, borderRadius: 24, background: '#000', zIndex: 51,
      }} />
      {children}
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.5)', zIndex: 50,
      }} />
    </div>
  );
}

function Dots() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="6" width="3" height="5" rx="0.5" />
      <rect x="4.6" y="3.5" width="3" height="7.5" rx="0.5" />
      <rect x="9.2" y="1" width="3" height="10" rx="0.5" />
      <rect x="13.8" y="0" width="3" height="11" rx="0.5" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
      <path d="M7.5 1.5C9.7 1.5 11.7 2.4 13.1 3.8L12 4.9c-1.2-1.2-2.8-1.9-4.5-1.9S4.2 3.7 3 4.9L1.9 3.8C3.3 2.4 5.3 1.5 7.5 1.5zM7.5 5c1.4 0 2.6 0.5 3.5 1.5L9.9 7.6c-.6-.7-1.5-1.1-2.4-1.1s-1.8 0.4-2.4 1.1L4 6.5C4.9 5.5 6.1 5 7.5 5zM7.5 8.4c.6 0 1.1 0.2 1.5 0.6L7.5 10.5 6 9c.4-0.4 0.9-0.6 1.5-0.6z" />
    </svg>
  );
}
function Battery() {
  return (
    <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
      <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="2" y="2" width="18" height="7" rx="1.5" fill="currentColor" />
      <path d="M23 4v3c0.6-0.2 1-0.8 1-1.5S23.6 4.2 23 4z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

function Btn({ theme, kind = 'primary', children, onClick, style = {}, full = false, disabled }) {
  const base = {
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontWeight: theme.weightHeavy, fontSize: 15,
    letterSpacing: theme.upperHeads ? 1.2 : 0,
    textTransform: theme.upperHeads ? 'uppercase' : 'none',
    padding: '14px 22px', borderRadius: theme.radius,
    transition: 'transform .08s, opacity .15s',
    width: full ? '100%' : undefined,
    opacity: disabled ? 0.4 : 1,
    ...style,
  };
  if (kind === 'primary') {
    Object.assign(base, {
      background: theme.accent, color: theme.accentText,
      boxShadow: `0 8px 24px -8px ${theme.accent}80`,
    });
  } else if (kind === 'secondary') {
    Object.assign(base, {
      background: theme.surface2, color: theme.text,
      border: `1px solid ${theme.border}`,
    });
  } else if (kind === 'ghost') {
    Object.assign(base, {
      background: 'transparent', color: theme.mutedStrong,
    });
  } else if (kind === 'danger') {
    Object.assign(base, {
      background: 'transparent', color: theme.danger,
      border: `1px solid ${theme.danger}40`,
    });
  }
  return (
    <button style={base} onClick={onClick} disabled={disabled}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}>
      {children}
    </button>
  );
}

function Card({ theme, children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface, borderRadius: theme.radiusLg,
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}>{children}</div>
  );
}

function Pill({ theme, children, color, fill = false, style = {} }) {
  const c = color || theme.accent;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: fill ? c : `${c}18`,
      color: fill ? theme.accentText : c,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
      textTransform: 'uppercase', fontFamily: theme.fontUI,
      ...style,
    }}>{children}</span>
  );
}

function Heading({ theme, children, size = 'lg', style = {} }) {
  const sizes = { sm: 14, md: 18, lg: 24, xl: 34, xxl: 56 };
  return (
    <h2 style={{
      margin: 0, fontFamily: theme.fontDisplay,
      fontWeight: theme.weightHeavy, fontSize: sizes[size],
      letterSpacing: theme.upperHeads ? (size === 'xxl' ? 0 : 1) : -0.3,
      textTransform: theme.upperHeads && size !== 'xxl' ? 'uppercase' : 'none',
      lineHeight: size === 'xxl' ? 1 : 1.15,
      ...style,
    }}>{children}</h2>
  );
}

function Label({ theme, children, style = {} }) {
  return (
    <div style={{
      fontFamily: theme.fontMono, fontSize: 10.5, fontWeight: 600,
      color: theme.muted, letterSpacing: 1.5, textTransform: 'uppercase',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────
function HomeScreen({ theme, state, setState, onStart, onOpenStats, onOpenSettings, onOpenPlates, onOpenCoach }) {
  const sessionId = FT.suggestSessionToday(state);
  const session = FT.TRAINING_PLAN[sessionId];
  const lastSession = FT.findLastSession(state, sessionId);

  const recentSessions = state.sessions.slice(-3).reverse();
  const streak = FT.calcStreak(state);
  const dow = new Date().getDay();
  const expectedToday = FT.SESSION_DOW[dow]; // 'A'|'B'|'C' if Mo/Mi/Fr else undefined
  const offDay = expectedToday && expectedToday !== sessionId;
  const restDay = !expectedToday && (dow === 0 || dow === 2 || dow === 4 || dow === 6);

  // Suggested weights for today
  const suggestions = session.exercises.map(ex => ({
    ex, w: FT.suggestNextWeight(ex, lastSession),
    last: FT.findLastForExercise(state, ex.id),
  }));

  // Bodyweight quick-add
  const [bwInput, setBwInput] = useState('');
  const lastBW = state.bodyweight[state.bodyweight.length - 1];

  return (
    <div style={{
      paddingTop: theme.padTop || 56, paddingBottom: `calc(40px + ${theme.padBot || '0px'})`,
      height: '100%', overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ padding: '12px 22px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Label theme={theme} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {new Date().toLocaleDateString('de-DE', { weekday: 'long' })} · Woche {state.weekNo}
          </Label>
          <div style={{ height: 6 }} />
          <Heading theme={theme} size="lg" style={{ color: theme.text }}>Bereit?</Heading>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn theme={theme} onClick={onOpenCoach} label="Coach">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 11a3 3 0 1 1 6 0c0 1.5-3 3-3 5"/><circle cx="12" cy="18.5" r="0.6" fill="currentColor"/></svg>
          </IconBtn>
          <IconBtn theme={theme} onClick={onOpenStats} label="Stats">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 20V10M9 20V4M15 20v-7M21 20v-12"/></svg>
          </IconBtn>
          <IconBtn theme={theme} onClick={onOpenSettings} label="Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
          </IconBtn>
        </div>
      </div>

      {/* STREAK / DAY-CONTEXT STRIP */}
      <div style={{ padding: '0 22px 14px', display: 'flex', gap: 8 }}>
        {streak > 0 && (
          <div style={{
            flex: '0 0 auto', padding: '10px 14px',
            borderRadius: theme.radius,
            background: `linear-gradient(135deg, ${theme.accent}25, ${theme.accent2 || theme.accent}15)`,
            border: `1px solid ${theme.accent}40`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: theme.fontDisplay,
                color: theme.text, lineHeight: 1, letterSpacing: theme.upperHeads ? 0.5 : 0 }}>
                {streak}
              </div>
              <div style={{ fontSize: 9.5, color: theme.muted, letterSpacing: 1, textTransform: 'uppercase', fontFamily: theme.fontMono }}>
                Streak
              </div>
            </div>
          </div>
        )}
        <div style={{
          flex: 1, padding: '10px 14px', borderRadius: theme.radius,
          background: theme.surface, border: `1px solid ${theme.border}`,
          fontSize: 12, color: theme.mutedStrong, lineHeight: 1.4,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {offDay ? (
            <>
              <span style={{ fontSize: 16 }}>📅</span>
              <span>Heute wäre <strong style={{ color: theme.accent2 }}>{expectedToday}</strong> dran — du hängst bei <strong>{sessionId}</strong>.</span>
            </>
          ) : restDay ? (
            <>
              <span style={{ fontSize: 16 }}>☕</span>
              <span>Ruhe-Tag. Trainingstage: Mo · Mi · Fr.</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 16 }}>✅</span>
              <span>Gym-Tag — los geht's.</span>
            </>
          )}
        </div>
      </div>

      {/* STEIGERUNGS-BANNER */}
      <ProgressionBanner theme={theme} session={session} suggestions={suggestions} weekNo={state.weekNo} />

      {/* HERO: today's session */}
      <div style={{ padding: '0 22px 18px' }}>
        <Card theme={theme} style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            borderRadius: '50%', background: `radial-gradient(circle, ${theme.accent}30 0%, transparent 65%)`,
          }} />
          <Label theme={theme}>Heute</Label>
          <div style={{ height: 4 }} />
          <Heading theme={theme} size="xxl" style={{ color: theme.accent, fontSize: 64 }}>
            {session.id}
          </Heading>
          <div style={{ marginTop: -4, fontFamily: theme.fontDisplay, fontSize: 22, fontWeight: theme.weightHeavy,
            color: theme.text, letterSpacing: theme.upperHeads ? 1 : -0.3,
            textTransform: theme.upperHeads ? 'uppercase' : 'none' }}>
            {session.name}
          </div>
          <div style={{ color: theme.muted, fontSize: 13, marginTop: 4 }}>
            {session.day} · {session.focus} · {session.exercises.length} Übungen
          </div>

          <div style={{ height: 16 }} />
          <Btn theme={theme} kind="primary" full onClick={onStart}>
            Session starten →
          </Btn>
        </Card>
      </div>

      {/* Today's exercises preview */}
      <div style={{ padding: '0 22px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <Label theme={theme}>Plan heute</Label>
          <span style={{ fontSize: 11, color: theme.muted }}>
            {lastSession ? `zuletzt: ${FT.daysAgo(lastSession.date)}` : 'neue Session'}
          </span>
        </div>
        <Card theme={theme} style={{ padding: 6 }}>
          {suggestions.map((s, i) => (
            <div key={s.ex.id} style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px',
              borderBottom: i < suggestions.length - 1 ? `1px solid ${theme.border}` : 'none',
              gap: 12,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: theme.surface2, display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: theme.accent, fontSize: 12,
                fontWeight: 700, fontFamily: theme.fontMono,
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.ex.name}</div>
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 1, fontFamily: theme.fontMono }}>
                  {s.ex.sets}×{s.ex.reps} · Pause {s.ex.restRange}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: theme.fontDisplay, color: theme.text }}>
                  {FT.fmtWeight(s.w)}<span style={{ fontSize: 11, color: theme.muted, marginLeft: 3 }}>kg</span>
                </div>
                {s.last && s.w > (s.last.weight || 0) && (
                  <div style={{ fontSize: 10, color: theme.success, fontWeight: 700 }}>
                    +{FT.fmtWeight(s.w - s.last.weight)}kg ↑
                  </div>
                )}
                {s.last && s.w === s.last.weight && (
                  <div style={{ fontSize: 10, color: theme.muted, fontWeight: 600 }}>
                    halten
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Tools strip */}
      <div style={{ padding: '0 22px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card theme={theme} style={{ padding: 14 }} onClick={onOpenPlates}>
          <Label theme={theme}>Tool</Label>
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700 }}>Plate Calc</div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>Welche Scheiben?</div>
        </Card>
        <Card theme={theme} style={{ padding: 14 }} onClick={() => {
          const v = parseFloat(bwInput.replace(',', '.'));
          if (v > 30 && v < 300) {
            setState(s => ({ ...s, bodyweight: [...s.bodyweight, { date: FT.todayISO(), kg: v }] }));
            setBwInput('');
          }
        }}>
          <Label theme={theme}>Bodyweight</Label>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <input value={bwInput} onChange={e => setBwInput(e.target.value)}
              placeholder={lastBW ? FT.fmtWeight(lastBW.kg) : '—'}
              style={{
                width: 50, background: 'transparent', border: 'none', outline: 'none',
                color: theme.text, fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
              }} />
            <span style={{ fontSize: 11, color: theme.muted }}>kg</span>
          </div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
            {lastBW ? `zuletzt ${FT.daysAgo(lastBW.date)}` : 'eintragen'}
          </div>
        </Card>
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div style={{ padding: '0 22px 18px' }}>
          <Label theme={theme} style={{ marginBottom: 10 }}>Letzte Sessions</Label>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '2px 0' }}>
            {recentSessions.map(s => {
              const sess = FT.TRAINING_PLAN[s.sessionId];
              const setCount = (s.exercises || []).reduce((a, e) => a + (e.sets?.length || 0), 0);
              return (
                <div key={s.date + s.sessionId} style={{
                  minWidth: 110, padding: 14, borderRadius: theme.radius,
                  background: theme.surface, border: `1px solid ${theme.border}`,
                }}>
                  <Pill theme={theme} color={theme.accent} fill>{s.sessionId}</Pill>
                  <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700 }}>{sess?.name}</div>
                  <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono, marginTop: 4 }}>
                    {FT.fmtDate(s.date)} · {setCount} Sätze
                  </div>
                  {s.feel && (
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      {'★'.repeat(s.feel)}<span style={{ color: theme.muted }}>{'☆'.repeat(5 - s.feel)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ height: 30 }} />
    </div>
  );
}

function IconBtn({ theme, onClick, children, label }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: 38, height: 38, borderRadius: theme.radius,
      background: theme.surface, border: `1px solid ${theme.border}`,
      color: theme.text, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESSION BANNER — "Heute steigern: Kniebeugen +2.5kg, …"
// Only shows when at least one ex actually has a +increment vs last time.
// ─────────────────────────────────────────────────────────────
function ProgressionBanner({ theme, session, suggestions, weekNo }) {
  const bumps = suggestions
    .map(s => ({ name: s.ex.name, delta: s.last ? s.w - s.last.weight : 0, w: s.w }))
    .filter(b => b.delta > 0);
  const holds = suggestions
    .filter(s => s.last && s.w === s.last.weight)
    .map(s => s.ex.name);

  if (weekNo <= 1) {
    return (
      <div style={{ padding: '0 22px 18px' }}>
        <div style={{
          padding: '12px 14px', borderRadius: theme.radius,
          background: theme.surface, border: `1px dashed ${theme.borderStrong}`,
          fontSize: 12, color: theme.mutedStrong, lineHeight: 1.5,
        }}>
          <strong style={{ color: theme.accent2, letterSpacing: 0.5 }}>WOCHE 1</strong> · Erst eingrooven.
          Ab Woche 2 zieht die Auto-Progression an.
        </div>
      </div>
    );
  }

  if (bumps.length === 0 && holds.length === 0) return null;

  return (
    <div style={{ padding: '0 22px 18px' }}>
      <div style={{
        padding: '14px 14px', borderRadius: theme.radius,
        background: bumps.length
          ? `linear-gradient(135deg, ${theme.success}15, ${theme.accent}10)`
          : theme.surface,
        border: `1px solid ${bumps.length ? theme.success + '40' : theme.border}`,
      }}>
        {bumps.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>📈</span>
              <div style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 1.2,
                color: theme.success, fontFamily: theme.fontMono,
                textTransform: 'uppercase',
              }}>
                Heute steigern · {bumps.length} Übung{bumps.length === 1 ? '' : 'en'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {bumps.map(b => (
                <div key={b.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: theme.text }}>
                  <span>{b.name}</span>
                  <span style={{ fontFamily: theme.fontMono, fontWeight: 700 }}>
                    <span style={{ color: theme.success }}>+{FT.fmtWeight(b.delta)}kg</span>
                    <span style={{ color: theme.muted }}> → {FT.fmtWeight(b.w)}kg</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {holds.length > 0 && (
          <div style={{ marginTop: bumps.length ? 8 : 0, fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
            Halten: {holds.join(' · ')}
          </div>
        )}
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
window.Frame = Frame;
window.Btn = Btn;
window.Card = Card;
window.Pill = Pill;
window.Heading = Heading;
window.Label = Label;
window.IconBtn = IconBtn;
window.useAppState = useAppState;
