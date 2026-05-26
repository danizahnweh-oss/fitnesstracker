/* global React, ReactDOM, FT, THEMES */
// app-main.jsx — top-level App with all screens + flows wired up

const { useState: useStateM, useEffect: useEffectM } = React;

function App({ theme }) {
  const [state, setState] = useAppState(theme);
  const [screen, setScreen] = useStateM('home'); // home | preCheck | workout | stats | settings | coach
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
