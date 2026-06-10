/* global React, ReactDOM, FT, THEMES */
// app-main.jsx - top-level App with all screens + flows wired up

const { useState: useStateM, useEffect: useEffectM } = React;

// ── Theme selection persistence ───────────────────────────────
// The selected skin (Beast / Iron / Neon) lives in localStorage and is
// applied on top of the runtime theme handed down by the canvas (which
// keeps mobile padding, safe-area insets and editor tweaks). Changing it
// fires THEME_EVENT so the App re-mounts the whole subtree with the new skin.
const THEME_KEY = 'ft.themeId';
const THEME_EVENT = 'ft:themechange';

function readThemeId() {
  try {
    const id = localStorage.getItem(THEME_KEY);
    if (id && window.THEMES && window.THEMES[id]) return id;
  } catch (e) { /* localStorage unavailable */ }
  return null;
}

window.FT_THEME = { KEY: THEME_KEY, EVENT: THEME_EVENT, read: readThemeId };

// Overlay the chosen skin's tokens onto the runtime theme. When the chosen
// skin matches the canvas base (typically Beast), the incoming theme is kept
// verbatim so editor tweaks (accent/font/glow) survive.
function applyThemeId(baseTheme, themeId) {
  if (!themeId || !window.THEMES || !window.THEMES[themeId]) return baseTheme;
  if (themeId === baseTheme.id) return baseTheme;
  const skin = window.THEMES[themeId];
  return {
    ...baseTheme,
    ...skin,
    // keep runtime-only fields the canvas computed
    isMobile: baseTheme.isMobile,
    padTop: baseTheme.padTop,
    padBot: baseTheme.padBot,
  };
}

function App({ theme: baseTheme }) {
  const [themeId, setThemeId] = useStateM(() => readThemeId());

  useEffectM(() => {
    function onChange() { setThemeId(readThemeId()); }
    window.addEventListener(THEME_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(THEME_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const theme = applyThemeId(baseTheme, themeId);

  return <AppShell key={theme.id} theme={theme} />;
}

function AppShell({ theme }) {
  const [state, setState] = useAppState(theme);
  const [screen, setScreen] = useStateM('home'); // home | preCheck | workout | stats | settings | coach | mobility
  const [plateModal, setPlateModal] = useStateM(null);
  const [celebrationPRs, setCelebrationPRs] = useStateM(null);
  const [pendingRecovery, setPendingRecovery] = useStateM(null);

  const sessionId = FT.suggestSessionToday(state);

  function startWorkout() {
    setScreen('preCheck');
  }

  function continueFromRecovery(recovery) {
    setPendingRecovery(recovery);
    setScreen('workout');
  }

  function skipRecovery() {
    setPendingRecovery(null);
    setScreen('workout');
  }

  return (
    <Frame theme={theme}>
      {screen === 'home' && (
        <HomeScreen theme={theme} state={state} setState={setState}
          onStart={startWorkout}
          onOpenStats={() => setScreen('stats')}
          onOpenSettings={() => setScreen('settings')}
          onOpenCoach={() => setScreen('coach')}
          onOpenMobility={() => setScreen('mobility')}
          onOpenPlates={() => setPlateModal({ target: 60, bar: state.settings.barWeight })}
        />
      )}
      {screen === 'preCheck' && (
        <>
          <HomeScreen theme={theme} state={state} setState={setState}
            onStart={() => {}}
            onOpenStats={() => {}}
            onOpenSettings={() => {}}
            onOpenCoach={() => {}}
            onOpenMobility={() => {}}
            onOpenPlates={() => {}}
          />
          <RecoveryCheck theme={theme}
            sessionName={FT.TRAINING_PLAN[sessionId].name}
            onContinue={continueFromRecovery}
            onSkip={skipRecovery}
          />
        </>
      )}
      {screen === 'workout' && (
        <WorkoutScreen theme={theme}
          state={{ ...state, __pendingRecovery: pendingRecovery }}
          setState={setState}
          sessionId={sessionId}
          onExit={() => { setScreen('home'); setPendingRecovery(null); }}
          onComplete={() => { setScreen('home'); setPendingRecovery(null); }}
          onCelebrate={(prs) => setCelebrationPRs(prs)}
          onOpenCoach={() => setScreen('coach')}
        />
      )}
      {screen === 'stats' && (
        <StatsScreen theme={theme} state={state} setState={setState}
          onClose={() => setScreen('home')} />
      )}
      {screen === 'settings' && (
        <SettingsScreen theme={theme} state={state} setState={setState}
          onClose={() => setScreen('home')} />
      )}
      {screen === 'coach' && (
        <CoachScreen theme={theme} state={state} setState={setState}
          onClose={() => setScreen('home')} />
      )}
      {screen === 'mobility' && (
        <MobilityScreen theme={theme} state={state} setState={setState}
          onClose={() => setScreen('home')} />
      )}
      {plateModal && (
        <PlateCalculator theme={theme} target={plateModal.target} bar={plateModal.bar}
          onClose={() => setPlateModal(null)} />
      )}
      {celebrationPRs && (
        <PRCelebration theme={theme} prs={celebrationPRs}
          onDismiss={() => setCelebrationPRs(null)} />
      )}
    </Frame>
  );
}

window.App = App;
