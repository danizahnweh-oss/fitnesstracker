# Product

## Register

product

## Users

Ein einzelner Nutzer: der Entwickler selbst, ein ernsthafter Hobby-Lifter, deutschsprachig. Kontext der Nutzung ist das Training selbst (Smartphone in der Hand, zwischen Sätzen, oft verschwitzt und in Eile) sowie die Auswertung danach. Kein fremdes Onboarding nötig, der Nutzer kennt jede Funktion. Entscheidungen dürfen kompromisslos auf diesen einen Workflow zugeschnitten sein statt auf einen anonymen Massenmarkt.

## Product Purpose

Ein mobiler Kraft- und Mobility-Tracker im iPhone-Mockup, der drei Dinge gleichwertig bedient: schnelles Erfassen einer Trainings-Session (Sätze, Gewicht, RPE/RIR, Pausentimer), das Sichtbarmachen von Fortschritt (Progression, geschätzter 1RM, Stats und Diagramme) und Anleitung (Übungstechnik per Coach-Video, Mobility-Posen). Erfolg heißt: während des Trainings reibungslos bedienbar, danach aussagekräftig genug, um die nächste Progression abzuleiten. Daten leben lokal (localStorage), kein Account, kein Backend.

## Brand Personality

Hart, motivierend, kompromisslos. Drei Worte: **schwer, laut, fokussiert.** Das Default-Theme "Beast Mode" trägt diesen Ton (tiefes Schwarz, Ember-Orange #FF4D14, Anton-Display, großzügige Zahlen). Zwei Alternativen existieren als Teil des Produkts ("Iron Pulse" ruhig/Lime, "Neon Lift" minimal/Cyan), aber der Default-Charakter ist Gym-Energie, nicht Wellness-Ruhe. Sprache: deutsch, direkt, knapp, kein Marketing-Sprech.

## Anti-references

- **Nicht generisch-SaaS.** Keine austauschbare hellgraue Dashboard-Optik mit blauen Buttons und endlosen identischen Card-Grids. Das hier ist eine App mit Haltung, kein Admin-Panel.
- **Nicht verspielt / bunt.** Keine Gamification-Maskottchen, keine pastellbunte Fun-App-Ästhetik (kein Duolingo-fürs-Gym). Motivation kommt aus Härte und klaren Zahlen, nicht aus Konfetti.
- Implizit auch nicht clinical-Apple-Health-steril: das dunkle, laute Default-Theme ist bewusst gewählt.

## Design Principles

1. **Daumen-zuerst.** Jede Trainingsaktion muss einhändig, im Stehen, mit minimalen Taps erreichbar sein. Reibung im Workout ist der teuerste Fehler.
2. **Zahlen sind die Helden.** Gewicht, Wiederholungen, 1RM, Progression: große, lesbare, monospaced-ausgerichtete Werte. Die Typografie dient den Daten.
3. **Härte statt Dekoration.** Visuelle Energie kommt aus Kontrast, Gewicht und Akzentfarbe, nicht aus Effekten um ihrer selbst willen. Wenn ein Element nichts zur Session beiträgt, fliegt es raus.
4. **Ein Charakter, drei Kleider.** Themes teilen denselben UX-Flow; ein Theme-Wechsel ändert nie das Verhalten, nur die Haut. Konsistenz der Interaktion über alle drei.
5. **Lokal und sofort.** Kein Ladespinner-Theater, kein Netzwerk-Warten. Der Zustand ist da, die App reagiert ohne Verzögerung.

## Accessibility & Inclusion

Persönliches Tool, daher kein formaler WCAG-Audit gefordert. Trotzdem bleiben die bereits vorhandenen soliden Defaults erhalten: sichtbare Fokus-Ringe (`:focus-visible`), respektierter `prefers-reduced-motion`, ausreichende Kontraste der dunklen Themes (heller Text auf tiefem Grund). Optik und Tempo dürfen im Zweifel Vorrang vor strenger Barrierefreiheit haben, aber bestehende Defaults nicht verschlechtern.
