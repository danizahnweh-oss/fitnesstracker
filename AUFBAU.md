# Fitnesstracker — Aufbau der Seite

Eine als iPhone-Mockup gestaltete React-App (lädt React + Babel direkt im Browser, ohne Build-Step). Einstieg über `Fitnesstracker.html` (Dev) bzw. `index.html` (gebündelte Single-File-Version, z. B. für GitHub Pages).

## 1. HTML-Einstieg

| Datei | Zweck |
| --- | --- |
| `index.html` | Gebündelte Single-File-Version — alle Skripte inline, geeignet für GitHub Pages |
| `Fitnesstracker.html` *(falls vorhanden)* | Schlanker Einstieg fürs Live-Laden der `.jsx`-Dateien |
| `manifest.json` | PWA-Manifest (App-Icon, Theme-Farbe `#FF4D14`) |
| `build.sh` | Skript, das die Single-File `index.html` aus den Quelldateien baut |

Im `<head>` werden Fonts (Inter, Anton, Space Grotesk, JetBrains Mono) und globale Styles geladen, der `<body>` enthält nur `<div id="root">` plus die Skript-Tags in **Abhängigkeitsreihenfolge**.

## 2. Lade-Reihenfolge der Skripte

```
react / react-dom / @babel/standalone   ← UMD via unpkg
lib.js                                  ← Geschäftslogik, Persistenz, Trainingsplan
themes.js                               ← Farben, Fonts, Mobile-Detection
tweaks-panel.jsx                        ← Dev-Tools-Panel
app-home.jsx                            ← UI-Primitive (Frame, Btn, Card …) + HomeScreen
app-workout-card.jsx                    ← Exercise-Karte für die Trainingsansicht
app-workout-rest.jsx                    ← Pausen-Timer-Overlay
app-workout.jsx                         ← WorkoutScreen-Orchestrator
app-stats.jsx                           ← StatsScreen + Diagramme
app-plates.jsx                          ← Hantelscheiben-Rechner (Modal)
app-settings.jsx                        ← SettingsScreen
app-recovery.jsx                        ← RecoveryCheck + PR-Celebration
app-coach-video.jsx                     ← Video-Overlay für den Coach
app-coach.jsx                           ← CoachScreen (Tabs)
app-mobility.jsx                        ← MobilityScreen + Pose-Anleitungen
app-main.jsx                            ← Wurzel-Komponente App + Routing
canvas.jsx                              ← Design-Canvas-Bootstrap
```

## 3. Wurzel-Komponente (`app-main.jsx`)

`App` hält den aktuellen Screen in `useState` und entscheidet anhand von `screen`, welche Bildschirm-Komponente innerhalb des `<Frame>` gerendert wird.

```
App
├── Frame                       ← iPhone-Hülle (Statusleiste, Dynamic Island, Home-Indicator)
│   ├── HomeScreen              (screen === 'home')
│   ├── HomeScreen + RecoveryCheck   (screen === 'preCheck')
│   ├── WorkoutScreen           (screen === 'workout')
│   ├── StatsScreen             (screen === 'stats')
│   ├── SettingsScreen          (screen === 'settings')
│   ├── CoachScreen             (screen === 'coach')
│   ├── MobilityScreen          (screen === 'mobility')
│   ├── PlateCalculator         (Modal, wenn plateModal gesetzt)
│   └── PRCelebration           (Modal, bei neuen Persönlichen Bestleistungen)
```

State-Persistenz läuft über den Hook `useAppState`, der auf `FT.loadState` / `FT.saveState` (aus `lib.js`) zurückgreift — typischerweise `localStorage`.

## 4. Bildschirme im Überblick

### 4.1 HomeScreen (`app-home.jsx`)
- Heutige Trainings-Session (`FT.suggestSessionToday`)
- Progressions-Banner (`ProgressionBanner`)
- Buttons zu Stats, Settings, Coach, Mobility, Hantelscheiben-Rechner
- Großer Start-Button → wechselt zu `preCheck`

### 4.2 RecoveryCheck (`app-recovery.jsx`)
- Kurzer Pre-Workout-Selbstcheck (Schlaf, Müdigkeit, Muskelkater …)
- `onContinue` übergibt die Recovery-Werte ans Workout, `onSkip` überspringt

### 4.3 WorkoutScreen (`app-workout.jsx`)
- Orchestriert eine komplette Trainings-Session
- Verwendet `ExerciseCard` (`app-workout-card.jsx`) je Übung
- `RestTimerOverlay` (`app-workout-rest.jsx`) zwischen Sätzen — RPE/RIR-Eingabe, Gewichtsanpassung
- `SessionSummary` am Ende → speichert die Session
- Kann zum Coach (`onOpenCoach`) und zur PR-Feier (`onCelebrate`) abzweigen

### 4.4 StatsScreen (`app-stats.jsx`)
- Übersichtskacheln (`Stat`), Mini-Diagramme (`MiniChart`)
- Pro Übung: `ExerciseStatCard` mit Verlauf und geschätztem 1RM

### 4.5 CoachScreen (`app-coach.jsx`)
Drei Tabs:
- **Feedback** — Auswertung der letzten Sessions
- **Cues** — Technik-Hinweise
- **Custom** — eigene Übungen über `CustomForm` anlegen

Zusätzlich: Video-Overlay aus `app-coach-video.jsx`.

### 4.6 MobilityScreen (`app-mobility.jsx`)
- Geführte Mobility-Sessions
- `MobilityPose` + `PoseFrame` für die grafische Darstellung der Posen
- `MobilityInstructions` als ausklappbare Anleitung je Übung
- Vorgefertigte Pose-Bibliothek im Modul-Konstanten-Objekt `POSES`

### 4.7 SettingsScreen (`app-settings.jsx`)
- `SettingRow`, `Toggle`, Theme-Wahl
- `AvailablePlatesEditor` für die im Studio vorhandenen Scheiben
- Stangengewicht, RPE-/RIR-Modus, gefährliche Aktionen (Reset)

### 4.8 PlateCalculator (`app-plates.jsx`)
- Modal: Zielgewicht + Stange → Scheibenkombination
- `BarbellVisual` zeichnet die Hantel grafisch

### 4.9 PRCelebration (`app-recovery.jsx`)
- Vollbild-Feier bei neuen persönlichen Bestleistungen

## 5. Querschnitts-Module

| Datei | Inhalt |
| --- | --- |
| `lib.js` | `FT`-Namespace: Trainingsplan, Set-Logik, 1RM-Schätzung, Persistenz, Vorschläge |
| `themes.js` | `THEMES`-Liste mit Farben, Fonts, `isMobile`-Flag |
| `tweaks-panel.jsx` | Floating-Panel zum Live-Editieren von Theme-Werten |
| `canvas.jsx` / `design-canvas.jsx` | Design-Galerie zum Nebeneinander-Darstellen mehrerer Themes |
| `ios-frame.jsx` | iPhone-Rahmen-Komponente für die Galerie |
| `build.sh` | Inlinet alle Skripte in `index.html` für GitHub-Pages-Deploy |

## 6. Komponenten-Hierarchie (kompakt)

```
Frame
└── Screen (Home | Workout | Stats | Settings | Coach | Mobility | preCheck)
    ├── UI-Primitive   Btn · Card · Pill · Heading · Label · IconBtn
    ├── Domain-Widgets ProgressionBanner · ExerciseCard · SetRow · RestTimerOverlay
    │                  Stat · MiniChart · ExerciseStatCard
    │                  RecoveryRow · BarbellVisual · ReplacePicker
    │                  MobilityPose · PoseFrame · MobilityInstructions
    └── Modals/Overlays PlateCalculator · PRCelebration · CoachVideo · ReplacePicker
```

## 7. Datenfluss in Kürze

1. `useAppState(theme)` lädt den State aus `localStorage`, gemerged mit Defaults aus `lib.js`.
2. Jede Änderung über `setState` wird automatisch persistiert (Effect in `useAppState`).
3. `App` reicht `state` + `setState` an jeden Bildschirm weiter — Screens schreiben in dieselbe Quelle.
4. Eine angefangene Session überlebt das Schließen der Seite: `state.activeWorkout` triggert beim Start direkt `screen === 'workout'`.
