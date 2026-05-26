/* global React, FT */
// app-settings.jsx — Settings screen + toggle/row primitives

// ─────────────────────────────────────────────────────────────
// SETTINGS SCREEN
// ─────────────────────────────────────────────────────────────
function SettingsScreen({ theme, state, setState, onClose }) {
  const s = state.settings;

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
        <Pill theme={theme} fill>Settings</Pill>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <Heading theme={theme} size="xl" style={{ color: theme.text }}>Einstellungen</Heading>
      </div>

      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* SOUND */}
        <SettingRow theme={theme} label="Sound am Pausen-Ende"
          subtitle="An / aus pro Session-Pause">
          <Toggle theme={theme} value={s.soundEnabled}
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
                { id: 'bell',  label: '🔔 Boxing Bell', desc: '3 Schläge' },
                { id: 'ding',  label: '🛎️ Ding',        desc: 'einfacher Ton' },
                { id: 'beep',  label: '📟 Beep',         desc: 'Doppel-Piep' },
                { id: 'silent',label: '🔕 Silent',       desc: 'nur Vibration' },
              ].map(opt => (
                <button key={opt.id} onClick={() => {
                  setState(st => ({ ...st, settings: { ...st.settings, soundKind: opt.id } }));
                  FT.playSound(opt.id, { ...s, soundKind: opt.id, soundEnabled: true });
                }} style={{
                  padding: '10px 12px', borderRadius: theme.radius,
                  background: s.soundKind === opt.id ? theme.accent : theme.surface2,
                  color: s.soundKind === opt.id ? theme.accentText : theme.text,
                  border: `1px solid ${s.soundKind === opt.id ? theme.accent : theme.border}`,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left',
                }}>
                  <div>{opt.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, fontFamily: theme.fontMono }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <SettingRow theme={theme} label="Vibration"
          subtitle="Zusätzlich zur Pause-Ende-Mitteilung">
          <Toggle theme={theme} value={s.vibrationEnabled}
            onChange={v => setState(st => ({ ...st, settings: { ...st.settings, vibrationEnabled: v } }))} />
        </SettingRow>

        <div style={{ height: 4 }} />

        {/* RPE / RIR mode */}
        <SettingRow theme={theme} label="RPE oder RIR?"
          subtitle="Wie willst du Anstrengung erfassen?">
          <div style={{ display: 'flex', background: theme.surface2, borderRadius: theme.radius, padding: 3, border: `1px solid ${theme.border}` }}>
            {[['rpe', 'RPE'], ['rir', 'RIR']].map(([k, l]) => (
              <button key={k} onClick={() => setState(st => ({ ...st, settings: { ...st.settings, rpeMode: k } }))} style={{
                padding: '6px 12px', borderRadius: theme.radius - 2,
                background: s.rpeMode === k ? theme.accent : 'transparent',
                color: s.rpeMode === k ? theme.accentText : theme.muted,
                border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{l}</button>
            ))}
          </div>
        </SettingRow>

        {/* Warmup style */}
        <SettingRow theme={theme} label="Aufwärm-Stil"
          subtitle="Wie automatische Warm-ups berechnet werden">
          <select value={s.warmupStyle}
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
            onChange={v => setState(st => ({ ...st, settings: { ...st.settings, wakeLockEnabled: v } }))} />
        </SettingRow>

        <div style={{ height: 4 }} />

        {/* Trainingswoche */}
        <SettingRow theme={theme} label="Trainingswoche"
          subtitle="Woche 1 = noch keine Steigerung">
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setState(st => ({ ...st, weekNo: Math.max(1, st.weekNo - 1) }))}
              style={tinyBtnSet(theme)}>−</button>
            <div style={{
              padding: '0 12px', height: 32, display: 'flex', alignItems: 'center',
              fontSize: 15, fontWeight: 700, fontFamily: theme.fontDisplay,
              background: theme.surface2, borderRadius: theme.radius,
              border: `1px solid ${theme.border}`, minWidth: 30, justifyContent: 'center',
            }}>{state.weekNo}</div>
            <button onClick={() => setState(st => ({ ...st, weekNo: st.weekNo + 1 }))}
              style={tinyBtnSet(theme)}>+</button>
          </div>
        </SettingRow>

        <SettingRow theme={theme} label="Standard-Stange"
          subtitle="für den Plate Calculator">
          <select value={s.barWeight}
            onChange={e => setState(st => ({ ...st, settings: { ...st.settings, barWeight: parseFloat(e.target.value) } }))}
            style={selectStyleSet(theme)}>
            <option value="20">20 kg</option>
            <option value="15">15 kg</option>
            <option value="10">10 kg</option>
            <option value="7">7 kg</option>
          </select>
        </SettingRow>

        <div style={{ height: 8 }} />

        <SettingRow theme={theme} label="Daten zurücksetzen"
          subtitle="Löscht alle Sessions und Bodyweight" danger>
          <Btn theme={theme} kind="danger"
            onClick={() => {
              if (confirm('Wirklich alle Daten löschen?')) {
                setState(FT.defaultState());
              }
            }} style={{ padding: '8px 14px', fontSize: 12 }}>
            Reset
          </Btn>
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
          (≤8.5 für Isolation), wird das Gewicht beim nächsten Mal um den ÜBungs-spezifischen
          Sprung erhöht (1.25kg / 2.5kg / 5kg). Sonst bleibt das Gewicht gleich bis du es schaffst.
        </div>

        <div style={{
          padding: 14, borderRadius: theme.radius,
          background: theme.surface, border: `1px solid ${theme.border}`,
          fontSize: 11, color: theme.muted,
        }}>
          <div style={{ color: theme.mutedStrong, fontWeight: 700, marginBottom: 6, fontFamily: theme.fontMono }}>
            Theme · {theme.name}
          </div>
          <div style={{ fontFamily: theme.fontMono }}>{theme.tagline}</div>
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

function Toggle({ theme, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
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
    width: 32, height: 32, borderRadius: theme.radius,
    background: theme.surface, border: `1px solid ${theme.border}`,
    color: theme.text, fontSize: 18, fontWeight: 700, fontFamily: 'inherit',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };
}

function selectStyleSet(theme) {
  return {
    padding: '7px 10px', borderRadius: theme.radius,
    background: theme.surface2, border: `1px solid ${theme.border}`,
    color: theme.text, fontSize: 13, fontFamily: 'inherit', fontWeight: 700,
    outline: 'none', appearance: 'none', WebkitAppearance: 'none',
  };
}

window.SettingsScreen = SettingsScreen;
