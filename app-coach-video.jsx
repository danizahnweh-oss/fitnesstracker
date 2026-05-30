/* global React, FT, Btn, Card, Label, Pill */
// app-coach-video.jsx — Video-Upload + Pose-/Winkel-Analyse (Coach Tab)

const { useState: useStateV, useEffect: useEffectV, useRef: useRefV, useMemo: useMemoV } = React;

const SUPPORTED_EXERCISES = ['squat', 'bench', 'deadlift'];

function VideoTab({ theme, state, setState }) {
  const [exerciseId, setExerciseId] = useStateV('squat');
  const [phase, setPhase] = useStateV('idle');      // idle | analyzing | done | error
  const [progress, setProgress] = useStateV(0);
  const [statusMsg, setStatusMsg] = useStateV('');
  const [error, setError] = useStateV('');
  const [result, setResult] = useStateV(null);
  const fileRef = useRefV(null);

  // Gespeicherten Report für aktuelle Übung laden, wenn nichts in der Session läuft
  const storedReport = useMemoV(
    () => state.videoAnalyses?.[exerciseId] || null,
    [state.videoAnalyses, exerciseId]
  );
  useEffectV(() => {
    if (phase === 'idle' || phase === 'done') {
      setResult(storedReport || null);
      setError('');
      setStatusMsg('');
      setProgress(0);
    }
  }, [exerciseId, storedReport]);

  async function onFileChosen(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) {
      setError('Video ist > 200 MB. Bitte kürzer aufnehmen oder vorher exportieren.');
      setPhase('error');
      return;
    }
    setPhase('analyzing');
    setProgress(0.02);
    setError('');
    setStatusMsg('🚀 Starte Analyse …');
    setResult(null);
    try {
      const report = await FT.analyzeVideoForPose(file, exerciseId, (msg, p) => {
        if (msg) setStatusMsg(msg);
        if (typeof p === 'number') setProgress(p);
      });
      // In localStorage ablegen (mit Größen-Guard)
      const saved = FT.saveVideoAnalysis(setState, exerciseId, report);
      setResult(saved);
      setPhase('done');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Unbekannter Fehler bei der Analyse.');
      setPhase('error');
    }
  }

  function reset() {
    setPhase('idle');
    setProgress(0);
    setStatusMsg('');
    setError('');
    setResult(storedReport || null);
  }

  return (
    <div style={{ padding: '0 22px' }}>
      {/* Übungsauswahl */}
      <Label theme={theme} style={{ marginBottom: 6 }}>Übung wählen</Label>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {SUPPORTED_EXERCISES.map(id => {
          const def = FT.FORM_ANGLES[id];
          const active = exerciseId === id;
          return (
            <button key={id} onClick={() => setExerciseId(id)} style={{
              flex: 1, padding: '10px 8px', borderRadius: theme.radius,
              background: active ? theme.accent : theme.surface2,
              color: active ? theme.accentText : theme.text,
              border: `1px solid ${active ? theme.accent : theme.border}`,
              fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
            }}>{def?.label || id}</button>
          );
        })}
      </div>

      {/* Upload-Karte */}
      <Card theme={theme} style={{ padding: 16 }}>
        <Label theme={theme}>Video-Analyse</Label>
        <div style={{ marginTop: 6, fontSize: 13, color: theme.mutedStrong, lineHeight: 1.5 }}>
          Lade ein kurzes Video (5–60 s) deines Satzes hoch.
          Am besten <strong>seitlich</strong> aufgenommen mit gut sichtbarem Ganzkörper.
          Die Analyse läuft komplett auf deinem Gerät.
        </div>
        <div style={{ height: 14 }} />
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          capture="environment"
          onChange={onFileChosen}
          style={{ display: 'none' }}
        />
        <Btn
          theme={theme}
          kind="primary"
          full
          onClick={() => fileRef.current?.click()}
          disabled={phase === 'analyzing'}
        >
          {phase === 'analyzing'
            ? '⏳ Analysiere …'
            : (result ? '📹 Neues Video analysieren' : '📹 Video auswählen')}
        </Btn>

        {phase === 'analyzing' && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              height: 6, borderRadius: 3, background: theme.surface2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${Math.round((progress || 0) * 100)}%`,
                background: theme.accent, transition: 'width .2s ease',
              }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: theme.muted, fontFamily: theme.fontMono }}>
              {statusMsg || '…'}
            </div>
          </div>
        )}
      </Card>

      {error && (
        <div style={{
          marginTop: 12, padding: 14, borderRadius: theme.radius,
          background: theme.danger + '15', color: theme.danger,
          border: `1px solid ${theme.danger}40`, fontSize: 12,
        }}>{error}</div>
      )}

      {/* Ergebnis */}
      {result && phase !== 'analyzing' && (
        <div style={{ marginTop: 14 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 10,
          }}>
            <Label theme={theme}>
              Letzte Analyse · {result.exerciseLabel || result.exerciseId}
            </Label>
            <span style={{ fontSize: 10, color: theme.muted, fontFamily: theme.fontMono }}>
              {result.generatedAt ? new Date(result.generatedAt).toLocaleString('de-DE') : ''}
            </span>
          </div>

          {result.imagesDroppedForStorage && (
            <div style={{
              marginBottom: 10, padding: 10, borderRadius: theme.radius,
              background: theme.surface2, fontSize: 11, color: theme.muted,
            }}>
              ℹ️ Bilder wurden aus Speicherplatz-Gründen verworfen — nur Winkelwerte sind erhalten.
            </div>
          )}

          {/* Keyframes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.keyframes.map((kf, i) => (
              <KeyframeCard key={i} theme={theme} kf={kf} />
            ))}
          </div>

          {/* Summary */}
          {result.summary && (
            <div style={{
              marginTop: 14, padding: 18, borderRadius: theme.radiusLg,
              background: theme.surface, border: `1px solid ${theme.border}`,
              fontSize: 13.5, lineHeight: 1.7, color: theme.text, whiteSpace: 'pre-wrap',
            }}>{result.summary}</div>
          )}

          {phase === 'done' && (
            <div style={{ marginTop: 12 }}>
              <Btn theme={theme} kind="ghost" full onClick={reset}>↺ Neue Analyse</Btn>
            </div>
          )}
        </div>
      )}

      {/* Privacy / Disclaimer */}
      <div style={{
        marginTop: 14, padding: 12, borderRadius: theme.radius,
        background: theme.surface2, fontSize: 10, color: theme.muted,
        fontFamily: theme.fontMono, lineHeight: 1.5,
      }}>
        🔒 Video wird lokal verarbeitet — nichts verlässt dein Gerät.
        Soll-Winkel sind Richtwerte; bei Schmerzen / Verletzungen mit Physio sprechen.
      </div>
    </div>
  );
}

function KeyframeCard({ theme, kf }) {
  return (
    <div style={{
      borderRadius: theme.radius, background: theme.surface,
      border: `1px solid ${theme.border}`, overflow: 'hidden',
    }}>
      {kf.dataUrl && (
        <div style={{ position: 'relative', background: '#000' }}>
          <img
            src={kf.dataUrl}
            alt={kf.phaseLabel}
            style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 280, objectFit: 'contain' }}
          />
          <div style={{
            position: 'absolute', left: 8, top: 8,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(0,0,0,0.7)', color: '#fff',
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
          }}>
            {kf.phaseLabel} · {kf.t.toFixed(1)} s
          </div>
        </div>
      )}
      <div style={{ padding: 14 }}>
        {!kf.dataUrl && (
          <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 700, color: theme.text }}>
            {kf.phaseLabel} · {kf.t.toFixed(1)} s
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {kf.checks.map((c, i) => (
            <CheckRow key={i} theme={theme} check={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckRow({ theme, check }) {
  const palette = {
    ok:      { bg: theme.accent + '20', fg: theme.accent || theme.text, label: '✓ ok' },
    warning: { bg: '#FFB80020',         fg: '#FFB800',                  label: '! knapp' },
    error:   { bg: theme.danger + '20', fg: theme.danger,               label: '✕ daneben' },
    unknown: { bg: theme.surface2,      fg: theme.muted,                label: '? unklar' },
  };
  const p = palette[check.state] || palette.unknown;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 10px', borderRadius: theme.radius,
      background: theme.surface2,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{check.label}</div>
        <div style={{ fontSize: 10, color: theme.muted, fontFamily: theme.fontMono, marginTop: 2 }}>
          {check.value != null ? `${check.value}°` : '—'} · Soll {check.range[0]}–{check.range[1]}°
        </div>
        {check.state !== 'ok' && check.state !== 'unknown' && check.tip && (
          <div style={{ fontSize: 11, color: theme.mutedStrong, marginTop: 4, lineHeight: 1.4 }}>
            {check.tip}
          </div>
        )}
      </div>
      <span style={{
        marginLeft: 10, padding: '4px 10px', borderRadius: 999,
        background: p.bg, color: p.fg,
        fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
      }}>{p.label}</span>
    </div>
  );
}

window.VideoTab = VideoTab;
