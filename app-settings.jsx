/* global React, FT */
// app-settings.jsx - Settings screen + toggle/row primitives

// ─────────────────────────────────────────────────────────────
// Section header — groups the flat settings list into chunks
// ─────────────────────────────────────────────────────────────
function SectionHeader({ theme, children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.6px', color: theme.muted,
      fontFamily: theme.fontUI, padding: '0 2px',
    }}>{children}</div>
  );
}

// Monochrome 14px stroke icons for the sound variants (currentColor).
function SoundIcon({ kind }) {
  const common = {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.2,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (kind) {
    case 'bell': // boxing bell
      return (<svg {...common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>);
    case 'ding': // single soft tone
      return (<svg {...common}><path d="M5 18h14"/><path d="M19 18a7 7 0 0 0-14 0"/><path d="M12 5V3"/></svg>);
    case 'beep': // double pulse / waveform
      return (<svg {...common}><path d="M3 12h3l2-6 4 14 2-8 2 4h5"/></svg>);
    case 'silent': // muted bell
      return (<svg {...common}><path d="M18 8a6 6 0 0 0-9.3-5"/><path d="M6 8c0 7-3 9-3 9h13"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/><path d="M3 3l18 18"/></svg>);
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Theme selector — real 3-way skin picker (Beast / Iron / Neon).
// Persists the chosen id to localStorage and fires the theme event so
// App (app-main.jsx) re-mounts with the new skin. Active option is marked
// with a single Ember border (Ein-Glut-Regel).
// ─────────────────────────────────────────────────────────────
function ThemeSelector({ theme }) {
  const themes = window.THEMES || {};
  const order = ['beast', 'iron', 'neon'].filter(id => themes[id]);
  const ft = window.FT_THEME;

  const [selected, setSelected] = React.useState(() => (ft && ft.read()) || theme.id);

  function pick(id) {
    setSelected(id);
    try { localStorage.setItem((ft && ft.KEY) || 'ft.themeId', id); } catch (e) { /* ignore */ }
    if (ft && ft.EVENT) window.dispatchEvent(new Event(ft.EVENT));
  }

  return (
    <div role="radiogroup" aria-label="Theme auswählen"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      {order.map(id => {
        const sk = themes[id];
        const active = selected === id;
        return (
          <button key={id} type="button" role="radio" aria-checked={active}
            aria-label={`Theme ${sk.name}`}
            onClick={() => pick(id)}
            style={{
              minHeight: 44, padding: '12px 10px', borderRadius: theme.radius,
              background: theme.surface2, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${active ? theme.accent : theme.border}`,
              boxShadow: active ? `0 0 0 1px ${theme.accent}` : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
              textAlign: 'left',
            }}>
            <span aria-hidden="true" style={{
              width: 22, height: 22, borderRadius: '50%',
              background: sk.accent, border: `1px solid ${theme.borderStrong}`,
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 12, fontWeight: 700, color: theme.text, lineHeight: 1.1,
            }}>{sk.name}</span>
            <span style={{
              fontSize: 10, color: theme.muted, lineHeight: 1.25, fontFamily: theme.fontMono,
            }}>{sk.tagline}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SETTINGS SCREEN
// ─────────────────────────────────────────────────────────────
function SettingsScreen({ theme, state, setState, onClose }) {
  const s = state.settings;
  const [confirmReset, setConfirmReset] = React.useState(false);

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: theme.padTop || 56, paddingBottom: `calc(30px + ${theme.padBot || '0px'})` }}>
      <div style={{ padding: '12px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: theme.muted,
          fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit', minHeight: 44, padding: '8px 4px', margin: '-8px -4px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Zurück
        </button>
        <Pill theme={theme} fill>Settings</Pill>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <Heading theme={theme} size="xl" style={{ color: theme.text }}>Einstellungen</Heading>
      </div>

      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionHeader theme={theme}>Audio &amp; Haptik</SectionHeader>
        {/* SOUND */}
        <SettingRow theme={theme} label="Sound am Pausen-Ende"
          subtitle="An / aus pro Session-Pause">
          <Toggle theme={theme} value={s.soundEnabled}
            ariaLabel="Sound am Pausen-Ende"
            onChange={v => setState(st => ({ ...st, settings: { ...st.settings, soundEnabled: v } }))} />
        </SettingRow>

        {s.soundEnabled && (
          <div style={{
            padding: 14, borderRadius: theme.radius,
            background: theme.surface, border: `1px solid ${theme.border}`,
          }}>
            <Label theme={theme} style={{ marginBottom: 8 }}>Sound-Variante</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { id: 'bell',  label: 'Boxing Bell', desc: '3 Schläge' },
                { id: 'ding',  label: 'Ding',        desc: 'einfacher Ton' },
                { id: 'beep',  label: 'Beep',         desc: 'Doppel-Piep' },
                { id: 'silent',label: 'Silent',       desc: 'nur Vibration' },
              ].map(opt => (
                <button key={opt.id} type="button" onClick={() => {
                  setState(st => ({ ...st, settings: { ...st.settings, soundKind: opt.id } }));
                  FT.playSound(opt.id, { ...s, soundKind: opt.id, soundEnabled: true });
                }} style={{
                  minHeight: 44, padding: '11px 16px', borderRadius: theme.radius,
                  background: s.soundKind === opt.id ? theme.accent2 : theme.surface2,
                  color: s.soundKind === opt.id ? theme.accentText : theme.text,
                  border: `1px solid ${s.soundKind === opt.id ? theme.accent2 : theme.border}`,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <SoundIcon kind={opt.id} />
                    <span>{opt.label}</span>
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, fontFamily: theme.fontMono }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <SettingRow theme={theme} label="Vibration"
          subtitle="Zusätzlich zur Pause-Ende-Mitteilung">
          <Toggle theme={theme} value={s.vibrationEnabled}
            ariaLabel="Vibration"
            onChange={v => setState(st => ({ ...st, settings: { ...st.settings, vibrationEnabled: v } }))} />
        </SettingRow>

        <div style={{ height: 12 }} />
        <SectionHeader theme={theme}>Training</SectionHeader>

        {/* RPE / RIR mode */}
        <SettingRow theme={theme} label="RPE oder RIR?"
          subtitle="Wie willst du Anstrengung erfassen?">
          <div role="radiogroup" aria-label="RPE oder RIR" style={{ display: 'flex', background: theme.surface2, borderRadius: theme.radius, padding: 3, border: `1px solid ${theme.border}` }}>
            {[['rpe', 'RPE'], ['rir', 'RIR']].map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={s.rpeMode === k}
                onClick={() => setState(st => ({ ...st, settings: { ...st.settings, rpeMode: k } }))} style={{
                minHeight: 44, padding: '11px 16px', borderRadius: theme.radius - 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: s.rpeMode === k ? theme.accent2 : 'transparent',
                color: s.rpeMode === k ? theme.accentText : theme.muted,
                border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{l}</button>
            ))}
          </div>
        </SettingRow>

        {/* Warmup style */}
        <SettingRow theme={theme} label="Aufwärm-Stil"
          subtitle="Wie automatische Warm-ups berechnet werden">
          <Label theme={theme} htmlFor="warmup-style" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Aufwärm-Stil</Label>
          <select id="warmup-style" name="warmupStyle" value={s.warmupStyle}
            onChange={e => setState(st => ({ ...st, settings: { ...st.settings, warmupStyle: e.target.value } }))}
            style={selectStyleSet(theme)}>
            <option value="standard">Standard (50% · 75%)</option>
            <option value="wendler">Wendler (40 · 50 · 60%)</option>
          </select>
        </SettingRow>

        {/* Wake Lock */}
        <SettingRow theme={theme} label="Screen-On im Workout"
          subtitle="Bildschirm bleibt während Training an">
          <Toggle theme={theme} value={s.wakeLockEnabled}
            ariaLabel="Screen-On im Workout"
            onChange={v => setState(st => ({ ...st, settings: { ...st.settings, wakeLockEnabled: v } }))} />
        </SettingRow>

        <div style={{ height: 4 }} />

        {/* Trainingswoche */}
        <SettingRow theme={theme} label="Trainingswoche"
          subtitle="Woche 1 = noch keine Steigerung">
          <div style={{ display: 'flex', gap: 4 }}>
            <button type="button" aria-label="Trainingswoche verringern" onClick={() => setState(st => ({ ...st, weekNo: Math.max(1, st.weekNo - 1) }))}
              style={tinyBtnSet(theme)}>−</button>
            <div style={{
              padding: '0 12px', height: 44, display: 'flex', alignItems: 'center',
              fontSize: 16, fontWeight: 700, fontFamily: theme.fontDisplay,
              background: theme.surface2, borderRadius: theme.radius,
              border: `1px solid ${theme.border}`, minWidth: 30, justifyContent: 'center',
            }}>{state.weekNo}</div>
            <button type="button" aria-label="Trainingswoche erhöhen" onClick={() => setState(st => ({ ...st, weekNo: st.weekNo + 1 }))}
              style={tinyBtnSet(theme)}>+</button>
          </div>
        </SettingRow>

        <SettingRow theme={theme} label="Standard-Stange"
          subtitle="für den Plate Calculator">
          <Label theme={theme} htmlFor="bar-weight" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Standard-Stange</Label>
          <select id="bar-weight" name="barWeight" value={s.barWeight}
            onChange={e => setState(st => ({ ...st, settings: { ...st.settings, barWeight: parseFloat(e.target.value) } }))}
            style={selectStyleSet(theme)}>
            <option value="20">20 kg</option>
            <option value="15">15 kg</option>
            <option value="10">10 kg</option>
            <option value="7">7 kg</option>
          </select>
        </SettingRow>

        <div style={{ height: 12 }} />
        <SectionHeader theme={theme}>Theme</SectionHeader>
        <ThemeSelector theme={theme} />

        <div style={{ height: 12 }} />
        <SectionHeader theme={theme}>Daten</SectionHeader>

        <SettingRow theme={theme} label="Daten zurücksetzen"
          subtitle={confirmReset ? 'Das kann nicht rückgängig gemacht werden.' : 'Löscht alle Sessions und Bodyweight'} danger>
          {confirmReset ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn theme={theme} kind="danger"
                onClick={() => { setState(FT.defaultState()); setConfirmReset(false); }}
                style={{ padding: '10px 12px', fontSize: 12 }}>
                Ja, löschen
              </Btn>
              <Btn theme={theme} kind="ghost"
                onClick={() => setConfirmReset(false)}
                style={{ padding: '10px 12px', fontSize: 12 }}>
                Abbrechen
              </Btn>
            </div>
          ) : (
            <Btn theme={theme} kind="danger"
              onClick={() => setConfirmReset(true)}
              style={{ padding: '10px 14px', fontSize: 12 }}>
              Reset
            </Btn>
          )}
        </SettingRow>

        <div style={{
          padding: 14, borderRadius: theme.radius,
          background: theme.surface, border: `1px solid ${theme.border}`,
          fontSize: 11, color: theme.muted, lineHeight: 1.6, fontFamily: theme.fontMono,
        }}>
          <div style={{ color: theme.mutedStrong, fontWeight: 700, marginBottom: 4 }}>
            Progression-Logik
          </div>
          Wenn alle Sätze sauber abgeschlossen wurden UND der durchschnittliche RPE ≤8 war
          (≤8.5 für Isolation), wird das Gewicht beim nächsten Mal um den übungsspezifischen
          Sprung erhöht (1.25 kg / 2.5 kg / 5 kg). Sonst bleibt das Gewicht gleich bis du es schaffst.
        </div>
      </div>
    </div>
  );
}

function SettingRow({ theme, label, subtitle, children, danger }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: theme.radius,
      background: theme.surface, border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: danger ? theme.danger : theme.text }}>{label}</div>
        {subtitle && <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ theme, value, onChange, ariaLabel }) {
  return (
    <button type="button" role="switch" aria-checked={!!value} aria-label={ariaLabel}
      onClick={() => onChange(!value)} style={{
      width: 50, height: 30, borderRadius: 15, padding: 2,
      background: value ? theme.accent : theme.surface2,
      border: `1px solid ${theme.border}`, cursor: 'pointer',
      transition: 'background .15s', position: 'relative',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: value ? theme.accentText : theme.muted,
        transform: value ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform .15s',
      }} />
    </button>
  );
}

function tinyBtnSet(theme) {
  return {
    width: 44, height: 44, borderRadius: theme.radius,
    background: theme.surface, border: `1px solid ${theme.border}`,
    color: theme.text, fontSize: 18, fontWeight: 700, fontFamily: 'inherit',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };
}

function selectStyleSet(theme) {
  const chevronStroke = encodeURIComponent(theme.muted);
  return {
    padding: '12px 32px 12px 12px', borderRadius: theme.radius,
    backgroundColor: theme.surface2, border: `1px solid ${theme.border}`,
    color: theme.text, fontSize: 16, fontFamily: 'inherit', fontWeight: 700,
    outline: 'none', appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${chevronStroke}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };
}

window.SettingsScreen = SettingsScreen;
