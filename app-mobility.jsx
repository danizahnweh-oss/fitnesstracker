/* global React, FT */
// app-mobility.jsx — Mobility-Sessions (Beweglichkeit, getrennt vom Krafttraining)
//
// View 1: Routinen-Auswahl + kurze Historie.
// View 2: Aktive Session — pro Übung Strichfigur-Pose, Timer (oder Wdh),
//         aufklappbare Anleitung (Setup, Schritte, Tipp, häufige Fehler).
//         Speichert {date, routineId, durationSec, completed} in state.mobility.

const { useState: useStateMob, useEffect: useEffectMob, useRef: useRefMob } = React;

// ─────────────────────────────────────────────────────────────
// SVG POSES — kleine Strichfiguren pro Bewegungstyp
// Erwartet { theme } als Prop. ViewBox 200×200.
// Konvention: Hauptkörper = theme.text, aktiver Teil = theme.accent.
// ─────────────────────────────────────────────────────────────
function PoseFrame({ theme, children }) {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%"
      style={{ display: 'block' }}
      strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Boden */}
      <line x1="10" y1="180" x2="190" y2="180" stroke={theme.muted} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 4" />
      {children}
    </svg>
  );
}

const POSES = {
  // 90/90 Sitz — Seitenansicht, Beine vorn/hinten gewinkelt
  seated_90_90: (theme) => (
    <PoseFrame theme={theme}>
      {/* Kopf */}
      <circle cx="100" cy="50" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk aufrecht */}
      <line x1="100" y1="61" x2="100" y2="118" stroke={theme.text} strokeWidth="4" />
      {/* Arme nach unten/leicht vorn */}
      <path d="M100 78 L78 110" stroke={theme.text} strokeWidth="3" />
      <path d="M100 78 L122 108" stroke={theme.text} strokeWidth="3" />
      {/* Vorderes Bein 90° */}
      <path d="M100 118 L150 145 L150 175" stroke={theme.accent} strokeWidth="4.5" />
      {/* Hinteres Bein 90° (gespiegelt zur Seite) */}
      <path d="M100 118 L60 138 L88 168" stroke={theme.accent} strokeWidth="4.5" />
      {/* Knie-Punkte */}
      <circle cx="150" cy="145" r="3" fill={theme.accent} />
      <circle cx="60" cy="138" r="3" fill={theme.accent} />
    </PoseFrame>
  ),

  // Couch-Stretch — Halbkniestand gegen Wand
  couch_stretch: (theme) => (
    <PoseFrame theme={theme}>
      {/* Wand rechts */}
      <line x1="170" y1="40" x2="170" y2="180" stroke={theme.muted} strokeOpacity="0.45" strokeWidth="2" />
      {/* Kopf */}
      <circle cx="80" cy="55" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk leicht nach hinten lehnend */}
      <line x1="80" y1="66" x2="92" y2="118" stroke={theme.text} strokeWidth="4" />
      {/* Arm auf vorderes Knie */}
      <path d="M85 78 L65 120" stroke={theme.text} strokeWidth="3" />
      <path d="M88 80 L100 118" stroke={theme.text} strokeWidth="3" />
      {/* Vorderes Bein 90° (links) */}
      <path d="M92 118 L65 145 L65 180" stroke={theme.text} strokeWidth="4" />
      <circle cx="65" cy="145" r="3" fill={theme.text} />
      {/* Hinteres Bein: Knie am Boden, Schienbein hoch zur Wand */}
      <path d="M92 118 L125 178" stroke={theme.accent} strokeWidth="4.5" />
      <path d="M125 178 L170 145" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="125" cy="178" r="3" fill={theme.accent} />
      {/* Fuß an Wand */}
      <line x1="166" y1="142" x2="174" y2="148" stroke={theme.accent} strokeWidth="3" />
    </PoseFrame>
  ),

  // Tiefe Hocke
  deep_squat: (theme) => (
    <PoseFrame theme={theme}>
      <circle cx="100" cy="38" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk leicht nach vorn */}
      <line x1="100" y1="49" x2="103" y2="98" stroke={theme.text} strokeWidth="4" />
      {/* Arme zwischen Knien */}
      <path d="M100 65 L78 95 L75 120" stroke={theme.text} strokeWidth="3" />
      <path d="M100 65 L122 95 L127 120" stroke={theme.text} strokeWidth="3" />
      {/* Beine — Hocke */}
      <path d="M103 98 L70 130 L72 178" stroke={theme.accent} strokeWidth="4.5" />
      <path d="M103 98 L135 130 L132 178" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="70" cy="130" r="3" fill={theme.accent} />
      <circle cx="135" cy="130" r="3" fill={theme.accent} />
    </PoseFrame>
  ),

  // Vierfüßler
  quadruped: (theme) => (
    <PoseFrame theme={theme}>
      {/* Kopf vorne links */}
      <circle cx="40" cy="92" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Rücken neutral, horizontal */}
      <line x1="51" y1="95" x2="150" y2="105" stroke={theme.accent} strokeWidth="4.5" />
      {/* Vorderbeine — Arme runter */}
      <line x1="56" y1="98" x2="58" y2="178" stroke={theme.text} strokeWidth="4" />
      {/* Hinterbeine — Knie am Boden, Unterschenkel */}
      <path d="M148 108 L150 150 L172 178" stroke={theme.text} strokeWidth="4" />
      <circle cx="150" cy="150" r="3" fill={theme.text} />
    </PoseFrame>
  ),

  // Schulter-CARs — Arm zeichnet großen Kreis
  shoulder_cars: (theme) => (
    <PoseFrame theme={theme}>
      <circle cx="100" cy="40" r="11" stroke={theme.text} strokeWidth="3" />
      <line x1="100" y1="51" x2="100" y2="130" stroke={theme.text} strokeWidth="4" />
      {/* Standarm links */}
      <line x1="100" y1="68" x2="78" y2="108" stroke={theme.text} strokeWidth="3" />
      {/* Aktiver Arm rechts — zeigt nach oben/außen */}
      <line x1="100" y1="68" x2="155" y2="50" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="155" cy="50" r="3" fill={theme.accent} />
      {/* Kreis-Andeutung */}
      <circle cx="100" cy="100" r="60" stroke={theme.accent} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 5" />
      {/* Pfeilspitze auf der Kreis-Bahn */}
      <path d="M150 145 L158 142 L156 152" stroke={theme.accent} strokeOpacity="0.55" strokeWidth="2" />
      {/* Beine */}
      <line x1="100" y1="130" x2="85" y2="178" stroke={theme.text} strokeWidth="4" />
      <line x1="100" y1="130" x2="115" y2="178" stroke={theme.text} strokeWidth="4" />
    </PoseFrame>
  ),

  // Band Pass-Through — Stab/Band überkopf, weite Hände
  band_overhead: (theme) => (
    <PoseFrame theme={theme}>
      <circle cx="100" cy="58" r="11" stroke={theme.text} strokeWidth="3" />
      <line x1="100" y1="69" x2="100" y2="140" stroke={theme.text} strokeWidth="4" />
      {/* Arme nach oben/außen breit */}
      <line x1="100" y1="78" x2="50" y2="42" stroke={theme.accent} strokeWidth="4.5" />
      <line x1="100" y1="78" x2="150" y2="42" stroke={theme.accent} strokeWidth="4.5" />
      {/* Band/Stab über dem Kopf */}
      <line x1="40" y1="36" x2="160" y2="36" stroke={theme.accent} strokeWidth="3.5" />
      <circle cx="40" cy="36" r="3.5" fill={theme.accent} />
      <circle cx="160" cy="36" r="3.5" fill={theme.accent} />
      {/* Beine */}
      <line x1="100" y1="140" x2="85" y2="178" stroke={theme.text} strokeWidth="4" />
      <line x1="100" y1="140" x2="115" y2="178" stroke={theme.text} strokeWidth="4" />
      {/* Bewegungspfeile */}
      <path d="M40 60 L40 28 M34 36 L40 26 L46 36" stroke={theme.accent} strokeOpacity="0.5" strokeWidth="2" />
    </PoseFrame>
  ),

  // Wall Slides — gegen Wand mit Armen oben (W/Y)
  wall_slides: (theme) => (
    <PoseFrame theme={theme}>
      {/* Wand links */}
      <line x1="48" y1="20" x2="48" y2="180" stroke={theme.muted} strokeOpacity="0.45" strokeWidth="2" />
      {/* Kopf */}
      <circle cx="62" cy="42" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk dicht an Wand */}
      <line x1="60" y1="53" x2="62" y2="135" stroke={theme.text} strokeWidth="4" />
      {/* Oberarme schräg nach oben (Y-form) */}
      <line x1="62" y1="70" x2="105" y2="38" stroke={theme.accent} strokeWidth="4.5" />
      <line x1="62" y1="70" x2="105" y2="92" stroke={theme.accent} strokeWidth="3.5" strokeOpacity="0.6" />
      {/* Unterarme bei 90° (vor Kopf) — Skizze */}
      <line x1="105" y1="38" x2="120" y2="55" stroke={theme.accent} strokeWidth="4.5" />
      {/* Beine leicht */}
      <line x1="62" y1="135" x2="55" y2="178" stroke={theme.text} strokeWidth="4" />
      <line x1="62" y1="135" x2="78" y2="178" stroke={theme.text} strokeWidth="4" />
      {/* Pfeil für Slide */}
      <path d="M155 60 L155 30 M149 38 L155 28 L161 38" stroke={theme.accent} strokeOpacity="0.5" strokeWidth="2" />
      <path d="M155 130 L155 100 M149 122 L155 132 L161 122" stroke={theme.accent} strokeOpacity="0.5" strokeWidth="2" />
    </PoseFrame>
  ),

  // Seitlage Open Book — Knie zusammen, oberer Arm öffnet auf
  side_lying: (theme) => (
    <PoseFrame theme={theme}>
      {/* Kopf rechts liegend */}
      <circle cx="170" cy="105" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk horizontal */}
      <line x1="159" y1="108" x2="80" y2="118" stroke={theme.text} strokeWidth="4" />
      {/* Unterer Arm liegt unten am Boden Richtung Kopf */}
      <line x1="155" y1="118" x2="130" y2="155" stroke={theme.text} strokeWidth="3" strokeOpacity="0.7" />
      {/* Oberer Arm geöffnet nach hinten/oben (Open Book) */}
      <line x1="155" y1="118" x2="95" y2="58" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="95" cy="58" r="3.5" fill={theme.accent} />
      {/* Beine gestapelt, Knie 90° */}
      <path d="M80 118 L40 122 L25 152" stroke={theme.text} strokeWidth="4" />
      <circle cx="40" cy="122" r="3" fill={theme.text} />
      {/* Rotations-Bogen */}
      <path d="M125 105 A 30 30 0 0 0 105 75" stroke={theme.accent} strokeOpacity="0.45" strokeWidth="2" strokeDasharray="3 4" />
    </PoseFrame>
  ),

  // BWS auf Foam Roller — Rückenlage, Roller unter Oberkörper
  tspine_roller: (theme) => (
    <PoseFrame theme={theme}>
      {/* Foam Roller — kleine Ellipse unter BWS */}
      <ellipse cx="100" cy="125" rx="22" ry="8" stroke={theme.muted} strokeOpacity="0.7" strokeWidth="2" fill={theme.surface2} />
      {/* Kopf nach hinten/oben offen */}
      <circle cx="62" cy="108" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Oberkörper schräg über Roller, BWS offen */}
      <line x1="73" y1="112" x2="123" y2="117" stroke={theme.accent} strokeWidth="4.5" />
      {/* Po am Boden */}
      <line x1="123" y1="117" x2="135" y2="148" stroke={theme.text} strokeWidth="4" />
      {/* Beine angewinkelt, Füße am Boden */}
      <path d="M135 148 L155 130 L173 175" stroke={theme.text} strokeWidth="4" />
      <circle cx="155" cy="130" r="3" fill={theme.text} />
      {/* Arme hinterm Kopf — Ellbogen vor Gesicht */}
      <path d="M70 100 L45 70 L72 60" stroke={theme.text} strokeWidth="3" />
      <path d="M75 102 L55 75" stroke={theme.text} strokeWidth="3" strokeOpacity="0.6" />
    </PoseFrame>
  ),

  // Knee-to-Wall — Halbkniestand vor Wand, Knie bewegt sich vor
  knee_to_wall: (theme) => (
    <PoseFrame theme={theme}>
      {/* Wand rechts */}
      <line x1="172" y1="40" x2="172" y2="180" stroke={theme.muted} strokeOpacity="0.45" strokeWidth="2" />
      {/* Kopf */}
      <circle cx="85" cy="58" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk aufrecht */}
      <line x1="85" y1="69" x2="92" y2="120" stroke={theme.text} strokeWidth="4" />
      {/* Hinteres Bein — Knie am Boden */}
      <path d="M92 120 L55 178" stroke={theme.text} strokeWidth="4" />
      {/* Vorderes Bein — Fuß flach, Knie zur Wand */}
      <path d="M92 120 L150 130" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="150" cy="130" r="3.5" fill={theme.accent} />
      <path d="M150 130 L138 178" stroke={theme.accent} strokeWidth="4.5" />
      {/* Fuß unten */}
      <line x1="125" y1="178" x2="155" y2="178" stroke={theme.accent} strokeWidth="3" />
      {/* Pfeil Knie zur Wand */}
      <path d="M155 130 L172 130 M167 124 L172 130 L167 136" stroke={theme.accent} strokeOpacity="0.6" strokeWidth="2" />
      {/* Arme an Hüfte */}
      <line x1="88" y1="80" x2="78" y2="108" stroke={theme.text} strokeWidth="3" />
      <line x1="88" y1="80" x2="105" y2="108" stroke={theme.text} strokeWidth="3" />
    </PoseFrame>
  ),

  // Wadenheben — auf Zehenspitzen
  calf_raise: (theme) => (
    <PoseFrame theme={theme}>
      <circle cx="100" cy="38" r="11" stroke={theme.text} strokeWidth="3" />
      <line x1="100" y1="49" x2="100" y2="118" stroke={theme.text} strokeWidth="4" />
      {/* Arme leicht seitlich */}
      <line x1="100" y1="62" x2="80" y2="100" stroke={theme.text} strokeWidth="3" />
      <line x1="100" y1="62" x2="120" y2="100" stroke={theme.text} strokeWidth="3" />
      {/* Beine gestreckt, Fersen hoch — Füße zur Zehe gekippt */}
      <line x1="100" y1="118" x2="85" y2="165" stroke={theme.accent} strokeWidth="4.5" />
      <line x1="100" y1="118" x2="115" y2="165" stroke={theme.accent} strokeWidth="4.5" />
      {/* Zehen unten am Boden */}
      <path d="M75 165 L92 178" stroke={theme.accent} strokeWidth="4.5" />
      <path d="M125 165 L108 178" stroke={theme.accent} strokeWidth="4.5" />
      {/* Pfeil hoch */}
      <path d="M150 90 L150 60 M144 68 L150 58 L156 68" stroke={theme.accent} strokeOpacity="0.55" strokeWidth="2" />
    </PoseFrame>
  ),

  // Fußkreisen — sitzendes Bein, Fuß rotiert
  ankle_circle: (theme) => (
    <PoseFrame theme={theme}>
      <circle cx="55" cy="60" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk leicht zurück gelehnt */}
      <line x1="55" y1="71" x2="68" y2="125" stroke={theme.text} strokeWidth="4" />
      {/* Arme hinten gestützt */}
      <line x1="55" y1="85" x2="35" y2="135" stroke={theme.text} strokeWidth="3" />
      <line x1="62" y1="88" x2="50" y2="138" stroke={theme.text} strokeWidth="3" />
      {/* Bein angehoben — Oberschenkel */}
      <line x1="68" y1="125" x2="125" y2="115" stroke={theme.text} strokeWidth="4" />
      {/* Unterschenkel */}
      <line x1="125" y1="115" x2="160" y2="100" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="125" cy="115" r="3" fill={theme.text} />
      {/* Fuß-Kreis */}
      <circle cx="167" cy="100" r="14" stroke={theme.accent} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="167" cy="100" r="3" fill={theme.accent} />
      {/* Pfeil im Kreis */}
      <path d="M180 102 L178 110 L172 106" stroke={theme.accent} strokeOpacity="0.7" strokeWidth="2" />
    </PoseFrame>
  ),

  // World's Greatest Stretch — Lunge mit Rotation, Arm zur Decke
  worlds_greatest: (theme) => (
    <PoseFrame theme={theme}>
      <circle cx="115" cy="60" r="11" stroke={theme.text} strokeWidth="3" />
      {/* Trunk leicht rotiert/lehnend */}
      <line x1="115" y1="71" x2="100" y2="115" stroke={theme.text} strokeWidth="4" />
      {/* Vorderes Bein tief gebeugt */}
      <path d="M100 115 L80 145 L65 178" stroke={theme.text} strokeWidth="4" />
      <circle cx="80" cy="145" r="3" fill={theme.text} />
      {/* Hinteres Bein gestreckt nach hinten */}
      <line x1="100" y1="115" x2="170" y2="178" stroke={theme.text} strokeWidth="4" />
      {/* Stützhand am Boden */}
      <path d="M110 82 L78 175" stroke={theme.text} strokeWidth="3" />
      <circle cx="78" cy="175" r="3" fill={theme.text} />
      {/* Aktiver Arm zur Decke */}
      <line x1="118" y1="80" x2="160" y2="22" stroke={theme.accent} strokeWidth="4.5" />
      <circle cx="160" cy="22" r="3.5" fill={theme.accent} />
      {/* Rotations-Bogen */}
      <path d="M135 75 A 25 25 0 0 1 152 45" stroke={theme.accent} strokeOpacity="0.45" strokeWidth="2" strokeDasharray="3 4" />
    </PoseFrame>
  ),
};

function MobilityPose({ theme, pose }) {
  const renderer = POSES[pose];
  return (
    <div style={{
      width: '100%', maxWidth: 240, aspectRatio: '1 / 1',
      background: theme.surface2,
      borderRadius: theme.radiusLg,
      border: `1px solid ${theme.border}`,
      padding: 14, boxSizing: 'border-box',
    }}>
      {renderer ? renderer(theme) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.muted, fontSize: 32 }}>🧘</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Anleitung — aufklappbar: Setup, Schritte, Tipp, Fehler
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
        <span>📖 Anleitung</span>
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
              <strong style={{ color: theme.accent2 }}>💡 Tipp:</strong> {ex.tip}
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
  const [routineId, setRoutineId] = useStateMob(null);
  const [stepIdx, setStepIdx] = useStateMob(0);
  const [doneView, setDoneView] = useStateMob(false);
  const [showInfo, setShowInfo] = useStateMob(false);
  const [now, setNow] = useStateMob(Date.now());
  const startedRef = useRefMob(Date.now());
  const bellPlayedRef = useRefMob(false);
  const sessionStartRef = useRefMob(0);

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

    const r = 88, cx = 120, cy = 120, circ = 2 * Math.PI * r;
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

        {/* Pose + Name + Side */}
        <div style={{ padding: '0 22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <MobilityPose theme={theme} pose={ex.pose} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ fontSize: 19, fontWeight: 800, textAlign: 'center' }}>{ex.name}</div>
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
          <button onClick={prev} disabled={stepIdx === 0} style={{
            flex: '0 0 auto', minWidth: 44, padding: '14px 10px',
            borderRadius: theme.radius,
            background: theme.surface2, border: `1px solid ${theme.border}`,
            color: stepIdx === 0 ? theme.muted : theme.text,
            opacity: stepIdx === 0 ? 0.4 : 1,
            cursor: stepIdx === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
          }}>←</button>
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
