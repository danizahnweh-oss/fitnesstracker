/* global React, FT */
// app-stats.jsx - Stats screen with per-exercise mini-graphs, PRs, water tracker

const { useState: useStateStats, useMemo: useMemoStats } = React;

// ─────────────────────────────────────────────────────────────
// STATS SCREEN - per-exercise mini-graphs, 1RM, recent history
// ─────────────────────────────────────────────────────────────
function StatsScreen({ theme, state, setState, onClose }) {
  // Collect all unique exercises across plan + customs
  const allEx = useMemoStats(() => {
    const seen = {};
    Object.values(FT.TRAINING_PLAN).forEach(sess => {
      sess.exercises.forEach(ex => { seen[ex.id] = ex; });
    });
    (state.customExercises || []).forEach(ex => { seen[ex.id] = ex; });
    return Object.values(seen);
  }, [state.customExercises]);

  const lastBW = state.bodyweight[state.bodyweight.length - 1];
  const streak = FT.calcStreak(state);
  const allPRs = FT.allTimePRs(state).slice(0, 6);
  const muscleVol = FT.volumeByMuscle(state, 7);
  const muscleVolEntries = Object.entries(muscleVol).sort((a, b) => b[1] - a[1]);
  const totalThisWeek = muscleVolEntries.reduce((s, [, v]) => s + v, 0);
  const todayWater = state.water?.find(w => w.date === FT.todayISO())?.glasses || 0;

  function changeWater(delta) {
    setState && setState(s => {
      const w = s.water || [];
      const idx = w.findIndex(x => x.date === FT.todayISO());
      const current = idx >= 0 ? w[idx].glasses : 0;
      const next = Math.max(0, Math.min(12, current + delta));
      if (idx >= 0) {
        return { ...s, water: w.map((x, i) => i === idx ? { ...x, glasses: next } : x) };
      }
      return { ...s, water: [...w, { date: FT.todayISO(), glasses: next }] };
    });
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: theme.padTop || 56, paddingBottom: `calc(30px + ${theme.padBot || '0px'})` }}>
      <div style={{ padding: '12px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: theme.muted,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit', padding: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Zurück
        </button>
        <Pill theme={theme} fill>Stats</Pill>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <Heading theme={theme} size="xl" style={{ color: theme.text }}>
          Fortschritt
        </Heading>
      </div>

      {/* Overall metrics */}
      <div style={{ padding: '0 22px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Stat theme={theme} label="Sessions" value={state.sessions.length} />
        <Stat theme={theme} label="Streak" value={streak ? `${streak}` : '0'} />
        <Stat theme={theme} label="Woche" value={state.weekNo} />
        <Stat theme={theme} label="BW" value={lastBW ? `${FT.fmtWeight(lastBW.kg)}` : '-'} />
      </div>

      {/* PR LIST */}
      {allPRs.length > 0 && (
        <div style={{ padding: '0 22px 14px' }}>
          <Label theme={theme} style={{ marginBottom: 8 }}>Persönliche Rekorde</Label>
          <Card theme={theme} style={{ padding: 0 }}>
            {allPRs.map((pr, i) => (
              <div key={pr.id} style={{
                padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: i < allPRs.length - 1 ? `1px solid ${theme.border}` : 'none',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: i === 0 ? theme.accent2 : theme.surface2,
                  color: i === 0 ? theme.accentText : theme.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, fontFamily: theme.fontMono,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{pr.name}</div>
                  <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
                    {FT.fmtWeight(pr.weight)}kg × {pr.reps} · {FT.fmtDate(pr.date)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, fontFamily: theme.fontDisplay, color: theme.success }}>
                    {Math.round(pr.est)}<span style={{ fontSize: 10, color: theme.muted, marginLeft: 2 }}>1RM</span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* VOLUME BY MUSCLE GROUP - last 7 days */}
      {muscleVolEntries.length > 0 && (
        <div style={{ padding: '0 22px 14px' }}>
          <Label theme={theme} style={{ marginBottom: 8 }}>Volumen pro Muskelgruppe · 7 Tage</Label>
          <Card theme={theme} style={{ padding: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {muscleVolEntries.map(([m, v], i) => {
                const pct = totalThisWeek > 0 ? (v / muscleVolEntries[0][1]) : 0;
                const isTop = i === 0;
                return (
                  <div key={m}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{m}</span>
                      <span style={{ fontSize: 11, fontFamily: theme.fontMono, color: theme.muted }}>
                        {Math.round(v).toLocaleString('de-DE')} kg
                      </span>
                    </div>
                    <div style={{ height: 6, background: theme.surface2, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct * 100}%`, height: '100%',
                        background: isTop ? theme.accent2 : theme.mutedStrong,
                        borderRadius: 3, transition: 'width .3s',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.border}`,
              fontSize: 11, color: theme.muted, fontFamily: theme.fontMono,
              display: 'flex', justifyContent: 'space-between' }}>
              <span>Gesamt</span>
              <span style={{ color: theme.text, fontWeight: 700 }}>{Math.round(totalThisWeek).toLocaleString('de-DE')} kg</span>
            </div>
          </Card>
        </div>
      )}

      {/* WATER TRACKER */}
      <div style={{ padding: '0 22px 14px' }}>
        <Label theme={theme} style={{ marginBottom: 8 }}>Wasser heute</Label>
        <Card theme={theme} style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: theme.fontDisplay }}>
              {todayWater}<span style={{ fontSize: 12, color: theme.muted, marginLeft: 4 }}>/ 8 Gläser</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" aria-label="Ein Glas weniger" disabled={todayWater <= 0}
                onClick={() => changeWater(-1)} style={{
                  width: 44, height: 44, borderRadius: theme.radius,
                  background: theme.surface2, color: todayWater <= 0 ? theme.muted : theme.text,
                  border: `1px solid ${theme.border}`,
                  fontWeight: 800, fontSize: 18, cursor: todayWater <= 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  opacity: todayWater <= 0 ? 0.5 : 1,
                }}>−</button>
              <button type="button" aria-label="Ein Glas hinzufügen" onClick={() => changeWater(1)} style={{
                minHeight: 44, padding: '10px 16px', borderRadius: theme.radius,
                background: theme.accent, color: theme.accentText, border: 'none',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}>+ Glas</button>
            </div>
          </div>
          <div role="progressbar" aria-label="Wasserziel heute" aria-valuemin="0" aria-valuemax="8" aria-valuenow={Math.min(todayWater, 8)} style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{
                flex: 1, height: 28, borderRadius: 4,
                background: i < todayWater ? theme.text : theme.surface2,
                border: `1px solid ${theme.border}`,
                opacity: i < todayWater ? 0.85 : 0.6,
              }} />
            ))}
          </div>
        </Card>
      </div>

      {/* Bodyweight chart */}
      {state.bodyweight.length > 1 && (
        <div style={{ padding: '0 22px 14px' }}>
          <Card theme={theme} style={{ padding: 14 }}>
            <Label theme={theme} style={{ marginBottom: 6 }}>Bodyweight Verlauf</Label>
            <MiniChart theme={theme} data={state.bodyweight.map(b => ({ x: b.date, y: b.kg }))} color={theme.accent2} unit="kg" />
          </Card>
        </div>
      )}

      {/* Per-exercise cards */}
      <div style={{ padding: '0 22px 14px' }}>
        <Label theme={theme} style={{ marginBottom: 8 }}>Übungen</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allEx.map(ex => {
            const hist = FT.exerciseHistory(state, ex.id, 12);
            if (hist.length === 0) return (
              <div key={ex.id} style={{
                padding: 14, borderRadius: theme.radius,
                background: theme.surface, border: `1px solid ${theme.border}`,
                opacity: 0.5,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>noch keine Daten</div>
              </div>
            );
            const oneRM = FT.bestEstimate1RM(state, ex.id);
            return (
              <ExerciseStatCard key={ex.id} theme={theme} ex={ex} history={hist} oneRM={oneRM} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ theme, label, value, small }) {
  return (
    <div style={{
      padding: 14, borderRadius: theme.radius,
      background: theme.surface, border: `1px solid ${theme.border}`,
    }}>
      <Label theme={theme}>{label}</Label>
      <div style={{
        marginTop: 4, fontSize: small ? 18 : 24,
        fontWeight: 800, fontFamily: theme.fontDisplay, color: theme.text,
      }}>{value}</div>
    </div>
  );
}

function ExerciseStatCard({ theme, ex, history, oneRM }) {
  const last = history[history.length - 1];
  const best = history.reduce((b, h) => h.weight > (b?.weight || 0) ? h : b, null);
  const data = history.map(h => ({ x: h.date, y: h.weight }));
  return (
    <div style={{
      padding: 14, borderRadius: theme.radius,
      background: theme.surface, border: `1px solid ${theme.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
        <div style={{ fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
          {history.length} Session{history.length === 1 ? '' : 's'}
        </div>
      </div>
      <MiniChart theme={theme} data={data} color={theme.accent2} unit="kg" />
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <Mini theme={theme} label="Aktuell" v={`${FT.fmtWeight(last.weight)}kg`} />
        <Mini theme={theme} label="Best" v={`${FT.fmtWeight(best?.weight || 0)}kg`} />
        <Mini theme={theme} label="1RM est." v={oneRM ? `${Math.round(oneRM)}kg` : '-'} />
      </div>
    </div>
  );
}

function Mini({ theme, label, v }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, color: theme.muted, letterSpacing: 1, textTransform: 'uppercase', fontFamily: theme.fontMono, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: theme.fontDisplay }}>{v}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MINI CHART - simple sparkline
// ─────────────────────────────────────────────────────────────
function MiniChart({ theme, data, color, unit }) {
  if (!data || data.length === 0) return null;
  if (data.length === 1) {
    return (
      <div style={{ fontSize: 12, color: theme.muted, fontFamily: theme.fontMono, padding: '14px 0' }}>
        {FT.fmtWeight(data[0].y)}{unit} (nur ein Datenpunkt)
      </div>
    );
  }
  const w = 320, h = 60, pad = 6;
  const ys = data.map(d => d.y);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const yRange = Math.max(1, yMax - yMin);
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.y - yMin) / yRange) * (h - pad * 2);
    return [x, y];
  });
  const path = 'M ' + points.map(p => p.join(',')).join(' L ');
  const area = path + ` L ${points[points.length - 1][0]},${h} L ${points[0][0]},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 60, display: 'block' }}>
      <path d={area} fill={color} fillOpacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} />
      ))}
    </svg>
  );
}

window.StatsScreen = StatsScreen;
window.MiniChart = MiniChart;
