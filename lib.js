// lib.js — vanilla data + helpers shared by all theme variants

// ─────────────────────────────────────────────────────────────
// TRAINING PLAN  (Restart Phase — Start 25.05.2026)
// ─────────────────────────────────────────────────────────────
const TRAINING_PLAN = {
  A: {
    id: 'A',
    name: 'Kraft A',
    day: 'Montag',
    focus: 'Ganzkörper · Kraft',
    exercises: [
      {
        id: 'squat',
        name: 'Kniebeugen',
        warmups: [{ w: 'Stange', r: 10 }, { w: 40, r: 5 }, { w: 55, r: 3 }],
        sets: 3, reps: 5, weight: 70, rest: 150,
        restRange: '2–3 min',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'bench',
        name: 'Bankdrücken',
        warmups: [{ w: 'Stange', r: 10 }, { w: 30, r: 5 }],
        sets: 3, reps: 5, weight: 45, rest: 105,
        restRange: '90–120 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'row',
        name: 'Langhantelrudern',
        warmups: [{ w: 30, r: 8 }],
        sets: 3, reps: 8, weight: 45, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
    ],
  },
  B: {
    id: 'B',
    name: 'Oberkörper',
    day: 'Mittwoch',
    focus: 'Hypertrophie',
    exercises: [
      {
        id: 'inclbench',
        name: 'Schrägbankdrücken',
        warmups: [], sets: 3, reps: 10, weight: 40, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'row2',
        name: 'Rudern',
        warmups: [], sets: 3, reps: 10, weight: 40, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'ohp_b',
        name: 'Overhead Press',
        warmups: [], sets: 3, reps: 12, weight: 22.5, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 1.25, bar: 20,
      },
      {
        id: 'curl',
        name: 'Bizepscurls',
        warmups: [], sets: 3, reps: 12, weight: 20, rest: 75,
        restRange: '60–90 s',
        type: 'isolation', increment: 1.25, bar: 20,
      },
      {
        id: 'lat',
        name: 'Seitheben',
        warmups: [], sets: 3, reps: 15, weight: 6, rest: 60,
        restRange: '60 s',
        type: 'isolation_db', increment: 1, bar: 0,
      },
    ],
  },
  C: {
    id: 'C',
    name: 'Kraft B',
    day: 'Freitag',
    focus: 'Ganzkörper · Kraft',
    exercises: [
      {
        id: 'squat',
        name: 'Kniebeugen',
        warmups: [{ w: 'Stange', r: 10 }, { w: 40, r: 5 }, { w: 55, r: 3 }],
        sets: 3, reps: 5, weight: 70, rest: 150,
        restRange: '2–3 min',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'ohp',
        name: 'Overhead Press',
        warmups: [{ w: 'Stange', r: 10 }, { w: 20, r: 5 }],
        sets: 3, reps: 5, weight: 30, rest: 105,
        restRange: '90–120 s',
        type: 'compound', increment: 1.25, bar: 20,
      },
      {
        id: 'deadlift',
        name: 'Kreuzheben',
        warmups: [{ w: 40, r: 5 }, { w: 60, r: 3 }],
        sets: 1, reps: 5, weight: 80, rest: 180,
        restRange: '3 min',
        type: 'compound', increment: 5, bar: 20,
      },
    ],
  },
};

const SESSION_ORDER = ['A', 'B', 'C'];
const SESSION_DOW = { 1: 'A', 3: 'B', 5: 'C' }; // Mo, Mi, Fr

// ─────────────────────────────────────────────────────────────
// MOBILITY  (separate routines — Beweglichkeit, getrennt vom Krafttraining)
// Übung: {id, name, desc} + entweder dur (Sek., getimt) oder reps (Wdh).
// Links/rechts = zwei Einträge mit _l/_r, je ein Timer-Schritt.
// ─────────────────────────────────────────────────────────────
const MOBILITY_ROUTINES = {
  hips: {
    id: 'hips',
    name: 'Hüfte',
    focus: 'Hüftöffner · Mobilität',
    est: 8,
    exercises: [
      { id: 'hip_90_90', name: '90/90 Hüftwechsel', desc: 'Aufrecht sitzen, langsam Seite wechseln, Brust hoch halten.', dur: 60, side: 'both' },
      { id: 'couch_l', name: 'Couch-Stretch (links)', desc: 'Hinteres Knie an die Wand, Becken aufrichten, Po anspannen.', dur: 45, side: 'left' },
      { id: 'couch_r', name: 'Couch-Stretch (rechts)', desc: 'Hinteres Knie an die Wand, Becken aufrichten, Po anspannen.', dur: 45, side: 'right' },
      { id: 'deep_squat', name: 'Tiefe Hocke halten', desc: 'Fersen am Boden, Ellenbogen drücken die Knie nach außen.', dur: 60, side: 'both' },
      { id: 'fire_hydrant', name: 'Fire Hydrants', desc: 'Im Vierfüßler, Knie kontrolliert seitlich heben — je Seite.', reps: 10, side: 'both' },
    ],
  },
  shoulders: {
    id: 'shoulders',
    name: 'Schultern',
    focus: 'Schultergürtel · Rotatoren',
    est: 7,
    exercises: [
      { id: 'sh_cars_l', name: 'Schulter-CARs (links)', desc: 'Großer, langsamer Kreis mit dem Arm — volle Kontrolle.', reps: 5, side: 'left' },
      { id: 'sh_cars_r', name: 'Schulter-CARs (rechts)', desc: 'Großer, langsamer Kreis mit dem Arm — volle Kontrolle.', reps: 5, side: 'right' },
      { id: 'band_dislocate', name: 'Band Pass-Throughs', desc: 'Band/Stab weit greifen, gestreckte Arme über den Kopf führen.', reps: 12, side: 'both' },
      { id: 'wall_slides', name: 'Wall Slides', desc: 'Rücken/Arme an der Wand, Arme hoch und runter gleiten.', dur: 45, side: 'both' },
      { id: 'thread_needle', name: 'Thread the Needle', desc: 'Im Vierfüßler Arm unter dem Körper durchfädeln, Brust öffnen.', dur: 40, side: 'both' },
    ],
  },
  tspine: {
    id: 'tspine',
    name: 'Brustwirbelsäule',
    focus: 'BWS-Rotation · Extension',
    est: 7,
    exercises: [
      { id: 'open_book_l', name: 'Open Book (links)', desc: 'Seitlage, oberen Arm öffnen, Blick folgt der Hand.', reps: 8, side: 'left' },
      { id: 'open_book_r', name: 'Open Book (rechts)', desc: 'Seitlage, oberen Arm öffnen, Blick folgt der Hand.', reps: 8, side: 'right' },
      { id: 'cat_cow', name: 'Katze-Kuh', desc: 'Wirbel für Wirbel runden und strecken, ruhig atmen.', dur: 60, side: 'both' },
      { id: 'tspine_ext', name: 'BWS-Extension (Rolle)', desc: 'Foam Roller unter BWS, kontrolliert nach hinten strecken.', dur: 45, side: 'both' },
      { id: 'quadruped_rot', name: 'Quadruped Rotation', desc: 'Hand an den Hinterkopf, Ellenbogen zur Decke rotieren.', reps: 8, side: 'both' },
    ],
  },
  ankles: {
    id: 'ankles',
    name: 'Sprunggelenke',
    focus: 'Dorsalflexion · Stabilität',
    est: 6,
    exercises: [
      { id: 'ankle_rock_l', name: 'Knee-to-Wall (links)', desc: 'Knie Richtung Wand schieben, Ferse bleibt am Boden.', dur: 40, side: 'left' },
      { id: 'ankle_rock_r', name: 'Knee-to-Wall (rechts)', desc: 'Knie Richtung Wand schieben, Ferse bleibt am Boden.', dur: 40, side: 'right' },
      { id: 'calf_raise', name: 'Wadenheben langsam', desc: 'Hoch auf die Zehen, oben halten, langsam ablassen.', reps: 15, side: 'both' },
      { id: 'ankle_circles', name: 'Fußkreisen', desc: 'Große, langsame Kreise je Fuß in beide Richtungen.', dur: 40, side: 'both' },
    ],
  },
  fullbody: {
    id: 'fullbody',
    name: 'Ganzkörper',
    focus: 'Kurzes Mobility-Flow',
    est: 10,
    exercises: [
      { id: 'fb_cat_cow', name: 'Katze-Kuh', desc: 'Wirbelsäule aufwärmen, ruhig atmen.', dur: 45, side: 'both' },
      { id: 'fb_worlds_greatest_l', name: "World's Greatest (links)", desc: 'Ausfallschritt, Ellenbogen zum Boden, dann Rotation öffnen.', dur: 40, side: 'left' },
      { id: 'fb_worlds_greatest_r', name: "World's Greatest (rechts)", desc: 'Ausfallschritt, Ellenbogen zum Boden, dann Rotation öffnen.', dur: 40, side: 'right' },
      { id: 'fb_deep_squat', name: 'Tiefe Hocke halten', desc: 'Fersen am Boden, Knie öffnen, aufrecht bleiben.', dur: 60, side: 'both' },
      { id: 'fb_band_dislocate', name: 'Band Pass-Throughs', desc: 'Schultern mobilisieren, gestreckte Arme.', reps: 12, side: 'both' },
      { id: 'fb_hip_90_90', name: '90/90 Hüftwechsel', desc: 'Langsam Seite wechseln, Brust hoch.', dur: 60, side: 'both' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// STORAGE  (theme-scoped so the 3 variants don't fight)
// ─────────────────────────────────────────────────────────────
function storageKey(theme) {
  return `fittracker_v2_${theme || 'default'}`;
}

function loadState(theme) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(theme)) || '{}');
  } catch { return {}; }
}

function saveState(theme, state) {
  try { localStorage.setItem(storageKey(theme), JSON.stringify(state)); }
  catch (e) { console.warn('save failed', e); }
}

function defaultState() {
  return {
    sessions: [],   // {date, sessionId, week, exercises, feel, notes, recovery:{sleep,soreness,energy,water}, prs}
    bodyweight: [], // {date, kg}
    water: [],      // {date, glasses}
    mobility: [],   // {date, routineId, durationSec, completed}
    currentSessionIdx: 0,
    weekNo: 1,
    customExercises: [],   // user-added
    replacements: {},      // {[sessionId-exId]: customExId}  -- swaps
    settings: {
      soundEnabled: true,
      soundKind: 'bell',         // bell | ding | beep | silent
      vibrationEnabled: true,
      barWeight: 20,
      rpeMode: 'rpe',            // 'rpe' (5-10) | 'rir' (0-4)
      warmupStyle: 'standard',   // 'standard' | 'wendler'
      pauseFirst: true,          // start pause immediately, log details during
      wakeLockEnabled: true,
      availablePlates: { 25: 2, 20: 2, 15: 2, 10: 2, 5: 2, 2.5: 2, 1.25: 2 },
    },
  };
}

function mergeDefaults(state) {
  const def = defaultState();
  return { ...def, ...state, settings: { ...def.settings, ...(state.settings || {}) } };
}

// ─────────────────────────────────────────────────────────────
// PROGRESSION
// Rule: if last session had all sets at target reps AND avg RPE ≤ ceiling,
// suggest +increment. Otherwise keep last weight.
// ─────────────────────────────────────────────────────────────
function rpeCeiling(ex) {
  if (ex.type === 'isolation' || ex.type === 'isolation_db') return 8.5;
  return 8;
}

function suggestNextWeight(ex, lastSession) {
  if (!lastSession) return ex.weight;
  const exHist = (lastSession.exercises || []).find(e => e.id === ex.id);
  if (!exHist) return ex.weight;
  const sets = exHist.sets || [];
  const lastWeight = exHist.weight ?? ex.weight;
  if (!sets.length) return lastWeight;
  const allDone = sets.length >= ex.sets && sets.every(s => (s.reps || 0) >= ex.reps);
  const rpes = sets.map(s => s.rpe).filter(r => r > 0);
  const avgRPE = rpes.length ? rpes.reduce((a, b) => a + b, 0) / rpes.length : 0;
  if (allDone && avgRPE > 0 && avgRPE <= rpeCeiling(ex)) {
    return lastWeight + ex.increment;
  }
  return lastWeight;
}

function findLastSession(state, sessionId) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    if (state.sessions[i].sessionId === sessionId) return state.sessions[i];
  }
  return null;
}

function findLastForExercise(state, exId) {
  // last session that contained this exercise
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const s = state.sessions[i];
    const e = (s.exercises || []).find(x => x.id === exId);
    if (e) return { date: s.date, weight: e.weight, sets: e.sets, sessionId: s.sessionId };
  }
  return null;
}

function exerciseHistory(state, exId, limit = 30) {
  const out = [];
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const s = state.sessions[i];
    const e = (s.exercises || []).find(x => x.id === exId);
    if (e) out.push({ date: s.date, weight: e.weight, sets: e.sets });
    if (out.length >= limit) break;
  }
  return out.reverse();
}

// ─────────────────────────────────────────────────────────────
// 1RM  (Epley) and warmup generator
// ─────────────────────────────────────────────────────────────
function estimate1RM(weight, reps) {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
}

function bestEstimate1RM(state, exId) {
  const hist = exerciseHistory(state, exId, 999);
  let best = 0;
  hist.forEach(h => {
    (h.sets || []).forEach(s => {
      const r = estimate1RM(h.weight, s.reps);
      if (r > best) best = r;
    });
  });
  return best;
}

// Auto-warmups: if no explicit warmups, build 2 from the work weight
function generateWarmups(ex, workWeight) {
  if (ex.warmups && ex.warmups.length) {
    // explicit, but anchor working sets onto suggested weight
    return ex.warmups;
  }
  if (ex.type === 'isolation' || ex.type === 'isolation_db') return [];
  const w1 = Math.max(ex.bar || 20, roundToPlate(workWeight * 0.5));
  const w2 = roundToPlate(workWeight * 0.75);
  if (w2 <= (ex.bar || 20)) return [];
  return [
    { w: w1, r: 8 },
    { w: w2, r: 5 },
  ];
}

function roundToPlate(w, step = 2.5) {
  return Math.round(w / step) * step;
}

// ─────────────────────────────────────────────────────────────
// PLATE CALCULATOR
// ─────────────────────────────────────────────────────────────
const PLATE_COLORS = {
  25: '#EF4444', 20: '#3B82F6', 15: '#F59E0B',
  10: '#10B981', 5: '#FFFFFF', 2.5: '#1F2937', 1.25: '#94A3B8',
};

function calcPlates(target, bar = 20) {
  const out = [];
  if (target < bar) return { ok: false, plates: [], remainder: target, bar };
  let perSide = (target - bar) / 2;
  const sizes = [25, 20, 15, 10, 5, 2.5, 1.25];
  for (const p of sizes) {
    while (perSide >= p - 0.0001) {
      out.push(p);
      perSide -= p;
    }
  }
  return { ok: Math.abs(perSide) < 0.0001, plates: out, remainder: perSide, bar };
}

// ─────────────────────────────────────────────────────────────
// BOXING BELL  via Web Audio (no asset, no licensing)
// ─────────────────────────────────────────────────────────────
let _ac = null;
function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state === 'suspended') _ac.resume();
  return _ac;
}

function playBell(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAC();
    const now = ctx.currentTime;
    // 3 quick strikes of the bell — boxing round ending
    [0, 0.18, 0.36].forEach((delay) => {
      // Bell = inharmonic stack
      const partials = [
        { f: 920,  g: 0.45, t: 'triangle' },
        { f: 1380, g: 0.30, t: 'sine'     },
        { f: 2300, g: 0.18, t: 'sine'     },
        { f: 3300, g: 0.10, t: 'sine'     },
      ];
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.0001, now + delay);
      masterGain.gain.exponentialRampToValueAtTime(1.0, now + delay + 0.005);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.3);

      partials.forEach(p => {
        const o = ctx.createOscillator();
        o.type = p.t; o.frequency.value = p.f;
        const g = ctx.createGain();
        g.gain.value = p.g;
        o.connect(g); g.connect(masterGain);
        o.start(now + delay);
        o.stop(now + delay + 1.4);
      });
    });
  } catch (e) { console.warn('bell failed', e); }
}

function playClick() {
  try {
    const ctx = getAC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square'; o.frequency.value = 1200;
    o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.start(t); o.stop(t + 0.08);
  } catch {}
}

// ─────────────────────────────────────────────────────────────
// FORMAT / DATE HELPERS
// ─────────────────────────────────────────────────────────────
function fmtTime(s) {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

function daysAgo(iso) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return 'heute';
  if (diff === 1) return 'gestern';
  return `vor ${diff} T`;
}

function fmtWeight(w) {
  if (w === 'Stange' || w == null) return w || '';
  if (Number.isInteger(w)) return String(w);
  return w.toString().replace('.', ',');
}

function suggestSessionToday(state) {
  // Cycle through A → B → C. Pick the next-in-cycle. If today matches Mon/Wed/Fri
  // and that matches the next one, perfect; if user is "off-cycle" we still
  // suggest the next-in-cycle so they don't repeat one.
  const idx = state.currentSessionIdx ?? 0;
  return SESSION_ORDER[idx % SESSION_ORDER.length];
}

// ─────────────────────────────────────────────────────────────
// MUSCLE GROUPS + FORM CUES (for Coach screen)
// ─────────────────────────────────────────────────────────────
const MUSCLE_MAP = {
  squat: ['Beine', 'Glutes', 'Core'],
  bench: ['Brust', 'Schultern', 'Trizeps'],
  inclbench: ['Brust (oben)', 'Schultern', 'Trizeps'],
  row: ['Rücken', 'Bizeps'],
  row2: ['Rücken', 'Bizeps'],
  ohp: ['Schultern', 'Trizeps', 'Core'],
  ohp_b: ['Schultern', 'Trizeps', 'Core'],
  deadlift: ['Rücken', 'Beine', 'Glutes'],
  curl: ['Bizeps'],
  lat: ['Schultern (Seite)'],
};

const FORM_CUES = {
  squat: {
    setup: 'Stange auf hinteren Schultern, Schulterblätter zusammen, schulterbreit + Zehen leicht raus.',
    cues: ['Druck in den Boden — Füße spreizen', 'Hüfte und Knie gleichzeitig beugen', 'Brust raus, neutraler Rücken', 'So tief bis Hüfte unter Knie'],
    mistakes: ['Knie kollabieren nach innen', 'Hacken heben sich', 'Hüfte schießt vor Brust hoch'],
  },
  bench: {
    setup: 'Augen unter Stange, Schulterblätter zurück + runter, leichter Brustbogen, Füße fest am Boden.',
    cues: ['Stange zum Brustbein', 'Ellenbogen ~45° (nicht ausgestellt)', 'Druck durch Mitte der Hand', 'Latissimus aktivieren'],
    mistakes: ['Ellenbogen flaggen aus', 'Po hebt von Bank', 'Stange wandert hoch zum Hals'],
  },
  inclbench: {
    setup: 'Bank 30–45°, sonst wie Flach-Bank. Stange landet höher (oberes Brustbein).',
    cues: ['Stange Richtung Schlüsselbein', 'Schulterblätter aktiv runter', 'Tempo: 2 sek excentric'],
    mistakes: ['Bank zu steil → wird OHP', 'Schultern ziehen hoch'],
  },
  row: {
    setup: 'Hüft-Hinge, ~30–45° Oberkörper, Knie leicht gebeugt, Stange am Bauchnabel.',
    cues: ['Ellenbogen zur Decke', 'Schulterblätter zusammen', 'Stange am Körper entlang', 'Rücken neutral'],
    mistakes: ['Oberkörper schwingt', 'Mit Bizeps statt Rücken ziehen', 'Tieflage zu flach'],
  },
  row2: {
    setup: 'Wie Langhantelrudern. Bei Maschine/Kabel: Sitz fest, Brust raus.',
    cues: ['Spüre den Rücken — nicht die Arme', 'Voll durchziehen', '2 sek Halten in Kontraktion'],
    mistakes: ['Schwung', 'Schulter rollen vor'],
  },
  ohp: {
    setup: 'Hüftbreit, Stange auf vorderen Schultern, Ellenbogen leicht vor Stange.',
    cues: ['Glutes + Core fest', 'Kopf leicht zurück, dann durchgehen', 'Stange grade nach oben', 'Triceps lockout'],
    mistakes: ['Übermäßige Hyperextension Wirbelsäule', 'Stange wandert vor', 'Kein Lockout'],
  },
  ohp_b: {
    setup: 'Gleich wie OHP — hier mit etwas höherem Volumen (12 Wdh).',
    cues: ['Bar Path: gerade hoch', 'Knöchel über Ellenbogen', 'Voller ROM'],
    mistakes: ['Halbe Wdh', 'Lower-Back-Hohlkreuz'],
  },
  deadlift: {
    setup: 'Mid-foot unter Stange, hüftbreit, Stange grenzt an Schienbein. Hüft-Hinge, Brust raus.',
    cues: ['Lat aktivieren — "Orangen unter Achseln"', 'Stange dicht am Körper', 'Push den Boden weg', 'Glutes oben anspannen'],
    mistakes: ['Rundrücken', 'Stange weg vom Körper', 'Hyperextension oben'],
  },
  curl: {
    setup: 'Stange schulterbreit, Ellenbogen am Körper fixiert.',
    cues: ['Nur Unterarm bewegt sich', 'Voller ROM (oben & unten)', 'Bicep peak halten'],
    mistakes: ['Schwung', 'Ellenbogen wandert vor', 'Halbe Wdh'],
  },
  lat: {
    setup: 'Stehen oder sitzen, leichte Knie-Beuge, Kurzhanteln neben Körper.',
    cues: ['Heben bis Schulterhöhe', 'Handgelenk neutral / leicht runter', 'Langsam ablassen (3 sek)', '"Wasser ausschütten"'],
    mistakes: ['Trapezius hochziehen', 'Schwingen', 'Über Schulterhöhe gehen'],
  },
};

function getCues(exId) { return FORM_CUES[exId] || null; }
function getMuscles(exId) { return MUSCLE_MAP[exId] || []; }

// ─────────────────────────────────────────────────────────────
// STREAK + STATS HELPERS
// ─────────────────────────────────────────────────────────────
function calcStreak(state) {
  if (!state.sessions.length) return 0;
  const dates = new Set(state.sessions.map(s => s.date));
  // Walk back from today; on each Mon/Wed/Fri, check if there's a session.
  let streak = 0;
  const today = new Date();
  // Allow today to be missing (workout maybe hasn't happened yet)
  for (let d = new Date(today), guard = 0; guard < 90; guard++, d.setDate(d.getDate() - 1)) {
    const dow = d.getDay();
    if (dow !== 1 && dow !== 3 && dow !== 5) continue;
    const iso = d.toISOString().slice(0, 10);
    if (dates.has(iso)) {
      streak++;
    } else {
      // skip today's missing — gym day not done yet
      if (iso === today.toISOString().slice(0, 10)) continue;
      break;
    }
  }
  return streak;
}

function sessionVolume(session) {
  return (session.exercises || []).reduce((vol, e) => {
    return vol + (e.sets || []).reduce((v, s) => v + (s.reps || 0) * (e.weight || 0), 0);
  }, 0);
}

function volumeByMuscle(state, days = 7) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  const result = {};
  state.sessions.forEach(s => {
    if (s.date < cutoffISO) return;
    (s.exercises || []).forEach(e => {
      const muscles = getMuscles(e.id);
      if (!muscles.length) return;
      const exVol = (e.sets || []).reduce((v, st) => v + (st.reps || 0) * (e.weight || 0), 0);
      const per = exVol / muscles.length;
      muscles.forEach(m => { result[m] = (result[m] || 0) + per; });
    });
  });
  return result;
}

// PR detection: compare current session's estimated 1RM vs all prior history
function detectPRs(state, currentSessionLog) {
  const prs = [];
  (currentSessionLog.exercises || []).forEach(e => {
    if (!e.sets?.length) return;
    const bestSetThis = e.sets.reduce((b, s) =>
      ((s.reps || 0) > 0 && estimate1RM(e.weight, s.reps) > (b ? estimate1RM(e.weight, b.reps) : 0))
        ? s : b, null);
    if (!bestSetThis) return;
    let bestPrior = 0;
    state.sessions.forEach(s => {
      (s.exercises || []).forEach(prev => {
        if (prev.id !== e.id) return;
        (prev.sets || []).forEach(ps => {
          const r = estimate1RM(prev.weight, ps.reps);
          if (r > bestPrior) bestPrior = r;
        });
      });
    });
    const thisEst = estimate1RM(e.weight, bestSetThis.reps);
    if (thisEst > bestPrior + 0.5 && bestPrior > 0) {
      prs.push({ id: e.id, name: e.name, weight: e.weight, reps: bestSetThis.reps, est: Math.round(thisEst) });
    }
  });
  return prs;
}

// Detect stall — 2+ sessions same type, same weight, missed reps
function detectStall(state, sessionId, exId) {
  const sessions = state.sessions.filter(s => s.sessionId === sessionId);
  if (sessions.length < 2) return false;
  const [a, b] = sessions.slice(-2);
  const eA = (a.exercises || []).find(e => e.id === exId);
  const eB = (b.exercises || []).find(e => e.id === exId);
  if (!eA || !eB) return false;
  return eA.weight === eB.weight;
}

// PR list (all-time best 1RM per exercise)
function allTimePRs(state) {
  const m = {};
  state.sessions.forEach(s => {
    (s.exercises || []).forEach(e => {
      (e.sets || []).forEach(st => {
        const est = estimate1RM(e.weight, st.reps);
        if (!m[e.id] || est > m[e.id].est) {
          m[e.id] = { id: e.id, name: e.name, weight: e.weight, reps: st.reps, est, date: s.date };
        }
      });
    });
  });
  return Object.values(m).sort((a, b) => b.est - a.est);
}

// ─────────────────────────────────────────────────────────────
// WARMUP GENERATORS
// ─────────────────────────────────────────────────────────────
function generateWarmupsWendler(ex, workWeight) {
  if (ex.type === 'isolation' || ex.type === 'isolation_db') return [];
  if (workWeight <= (ex.bar || 20)) return [];
  return [
    { w: Math.max(ex.bar || 20, roundToPlate(workWeight * 0.4, 2.5)), r: 5 },
    { w: Math.max(ex.bar || 20, roundToPlate(workWeight * 0.5, 2.5)), r: 5 },
    { w: Math.max(ex.bar || 20, roundToPlate(workWeight * 0.6, 2.5)), r: 3 },
  ];
}

function generateWarmupsBy(style, ex, workWeight) {
  // Respect plan-provided warmups regardless of style
  if (ex.warmups && ex.warmups.length) return ex.warmups;
  if (style === 'wendler') return generateWarmupsWendler(ex, workWeight);
  return generateWarmups(ex, workWeight);
}

// ─────────────────────────────────────────────────────────────
// SOUND VARIANTS
// ─────────────────────────────────────────────────────────────
function playDing() {
  try {
    const ctx = getAC();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 1480;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    o.start(t); o.stop(t + 1.7);
  } catch {}
}

function playBeep() {
  try {
    const ctx = getAC();
    [0, 0.18].forEach((d) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 1000;
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + d;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.start(t); o.stop(t + 0.2);
    });
  } catch {}
}

function playSound(kind, settings) {
  if (!settings || !settings.soundEnabled) {
    if (settings?.vibrationEnabled && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
    return;
  }
  if (settings.vibrationEnabled && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  if (kind === 'silent' || kind === 'none') return;
  if (kind === 'ding') return playDing();
  if (kind === 'beep') return playBeep();
  return playBell(true);
}

// ─────────────────────────────────────────────────────────────
// WAKE LOCK (keep screen awake during workout)
// ─────────────────────────────────────────────────────────────
let _wakeLock = null;
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return false;
  try {
    _wakeLock = await navigator.wakeLock.request('screen');
    return true;
  } catch { return false; }
}
function releaseWakeLock() {
  if (_wakeLock) { try { _wakeLock.release(); } catch {} _wakeLock = null; }
}

// ─────────────────────────────────────────────────────────────
// RPE/RIR conversion
// ─────────────────────────────────────────────────────────────
function rpeToRir(rpe) { return Math.max(0, 10 - rpe); }
function rirToRpe(rir) { return 10 - rir; }

// ─────────────────────────────────────────────────────────────
// CUSTOM EXERCISES (merge with plan via replacements map)
// ─────────────────────────────────────────────────────────────
function getSessionExercises(state, sessionId) {
  const session = TRAINING_PLAN[sessionId];
  if (!session) return [];
  return session.exercises.map(ex => {
    const key = `${sessionId}-${ex.id}`;
    const replId = state.replacements?.[key];
    if (replId) {
      const custom = (state.customExercises || []).find(c => c.id === replId);
      if (custom) return { ...custom, replacedFrom: ex.id };
    }
    return ex;
  });
}

function getMobilityRoutine(id) { return MOBILITY_ROUTINES[id] || null; }
function listMobilityRoutines() { return Object.values(MOBILITY_ROUTINES); }

// ─────────────────────────────────────────────────────────────
// EXPORT TO WINDOW
// ─────────────────────────────────────────────────────────────
window.FT = {
  TRAINING_PLAN, SESSION_ORDER, SESSION_DOW, PLATE_COLORS,
  MUSCLE_MAP, FORM_CUES, MOBILITY_ROUTINES,
  loadState, saveState, defaultState, mergeDefaults,
  suggestNextWeight, findLastSession, findLastForExercise, exerciseHistory,
  estimate1RM, bestEstimate1RM, generateWarmups, generateWarmupsWendler, generateWarmupsBy,
  roundToPlate, calcPlates,
  playBell, playDing, playBeep, playClick, playSound,
  fmtTime, todayISO, fmtDate, daysAgo, fmtWeight,
  suggestSessionToday, rpeCeiling,
  // new
  calcStreak, sessionVolume, volumeByMuscle, detectPRs, detectStall, allTimePRs,
  getCues, getMuscles, getSessionExercises,
  getMobilityRoutine, listMobilityRoutines,
  requestWakeLock, releaseWakeLock,
  rpeToRir, rirToRpe,
};
