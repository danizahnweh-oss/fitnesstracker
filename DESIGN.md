---
name: Fitnesstracker
description: Mobiler Kraft- und Mobility-Tracker im iPhone-Mockup, hart und zahlen-fokussiert.
colors:
  ember: "#FF4D14"
  gold: "#FFB020"
  ink: "#0A0908"
  surface: "#15110E"
  surface-2: "#1F1813"
  text: "#FAF7F2"
  muted: "#A39C92"
  success: "#84CC16"
  danger: "#EF4444"
  border: "#FFFFFF12"
  border-strong: "#FFFFFF24"
typography:
  display:
    fontFamily: "Anton, 'Bebas Neue', Oswald, Inter, sans-serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: "0.5px"
  headline:
    fontFamily: "Anton, 'Bebas Neue', Inter, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.6px"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "22px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "16px"
  pill:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Fitnesstracker

## 1. Overview

**Creative North Star: "Das Stahl-Cockpit"**

Die App ist ein Cockpit fürs Eisen: dunkel wie ein Gym im Halblicht, mit einem einzigen glühenden Akzent (Ember-Orange), der wie der Sucher eines Geräts führt. Sie lebt in einem iPhone-Mockup-Rahmen und verhält sich wie native iOS-App. Persönlichkeit: **schwer, laut, fokussiert.** Die Anton-Display-Schrift trägt Überschriften wie eingestanzte Plaketten, monospaced Ziffern stehen für Gewichte und Wiederholungen wie auf einer Anzeige. Dichte ist hoch, aber nie überladen: jeder Screen hat genau einen Helden (die heutige Session, der aktuelle Satz, der nächste PR).

Das System lehnt zwei Dinge ausdrücklich ab. Erstens **generisch-SaaS**: keine hellgrauen Dashboards, keine blauen Default-Buttons, keine endlosen identischen Card-Grids. Zweitens **verspielt-bunt**: keine Gamification-Maskottchen, keine Pastell-Fun-Ästhetik. Motivation kommt aus Härte und klaren Zahlen, nicht aus Konfetti.

Das Produkt liefert drei Häute über demselben UX-Flow: **Beast Mode** (Default, Schwarz + Ember, Anton, scharf), **Iron Pulse** (Charcoal-Navy + Lime, runder, ruhig) und **Neon Lift** (Violett + Cyan, mono, minimal). Dieses Dokument beschreibt **Beast Mode als kanonisch**; die anderen erben dieselbe Token-Struktur (`theme.accent`, `theme.surface`, `theme.radius` …) und ändern nur Werte, nie Verhalten.

**Key Characteristics:**
- Dunkler Grund (`#0A0908`) mit radialem Ember-Glow von oben, nie Flat-Schwarz
- Ein glühender Akzent (`#FF4D14`) als einzige laute Farbe; Gold (`#FFB020`) sekundär
- Anton-Display für Zahlen und Headlines, Inter für UI-Text, JetBrains Mono für Messwerte
- iPhone-Frame als bewusster Container (Dynamic Island, Home-Indicator, Safe-Areas)
- Token-getrieben über drei Themes; ein Theme-Wechsel ist rein kosmetisch

## 2. Colors

Eine fast monochrom dunkle Basis, in der eine einzige glühende Akzentfarbe die Aufmerksamkeit lenkt.

### Primary
- **Ember Orange** (`#FF4D14`): Der Held. Primär-Buttons, aktive Zustände, Fortschrittsbalken, der Start-Button, jede Stelle, die "jetzt hier" sagt. Trägt auch den PWA-Theme-Akzent.

### Secondary
- **Signal Gold** (`#FFB020`): Zweite Stimme. Fokus-Ringe (`:focus-visible`), Hervorhebungen, sekundäre Pills, PR-Feiern. Wärmer als Ember, nie konkurrierend.

### Neutral
- **Ink Black** (`#0A0908`): Körper-Hintergrund, immer mit radialem `radial-gradient(ellipse at top, #1A0F0A 0%, #0A0908 65%)`, nie als plattes Schwarz. Auch Textfarbe auf Ember-Buttons (`accentText`).
- **Surface** (`#15110E`) / **Surface-2** (`#1F1813`): Karten und gehobene Flächen. Surface-2 für verschachtelte oder interaktive Elemente.
- **Bone White** (`#FAF7F2`): Primärtext. Warmes Off-White, kein reines Weiß.
- **Muted** (`rgba(250,247,242,0.55)`): Sekundärtext, Labels, Hilfstexte. Stärkere Variante `mutedStrong` (0.78) für lesbarere Hilfstexte.
- **Hairline Borders** (`rgba(255,255,255,0.07)` / `0.14`): Kartenränder als kaum sichtbare Lichtkante, nie als harte Linie.

### Tertiary
- **Lime Success** (`#84CC16`): Erfolg, abgeschlossene Sätze, positive Deltas.
- **Red Danger** (`#EF4444`): Zerstörende Aktionen, negative Warnungen.

### Named Rules
**Die Ein-Glut-Regel.** Pro Screen leuchtet genau eine Ember-Fläche als primärer Call-to-Action. Wenn zwei Dinge gleichzeitig glühen, glüht keines. Sekundäres lenkt über Gold oder Surface-2, nie über ein zweites Ember.

**Die Kein-Flat-Schwarz-Regel.** Der Hintergrund ist immer der radiale Ember-Verlauf, nie `#000` oder ein einzelner Hex-Block. Tiefe entsteht aus dem Glow von oben.

## 3. Typography

**Display Font:** Anton (mit Fallback Bebas Neue, Oswald, Inter)
**Body Font:** Inter (mit Fallback system-ui)
**Label/Mono Font:** JetBrains Mono

**Character:** Anton ist kondensiert, schwer, fast plakatartig: ideal für große Zahlen und kurze Headlines, die wie eingestanzt wirken. Inter trägt den lesbaren UI-Text dazu im Kontrast (humanistisch vs. kondensiert-grotesk). JetBrains Mono richtet Messwerte (Gewicht, kg, Wdh., 1RM) tabellarisch aus, damit Ziffern beim Scrollen nicht springen.

### Hierarchy
- **Display** (Anton 400, 56px, lh 1.0): Größte Zahlen und Hero-Headlines (z. B. Session-Titel, PR-Werte). In Beast Mode uppercase.
- **Headline** (Anton 400, 34px, lh 1.05): Screen-Überschriften, Sektionstitel.
- **Title** (Inter 700, 18px): Karten-Titel, Übungsnamen.
- **Body** (Inter 500, 15px, lh 1.45): Fließtext, Beschreibungen, Anleitungen. Auf Mobile selten über ~40ch breit, daher unkritisch.
- **Label** (Inter 700, 11px, +0.6px, uppercase): Pills, Mikro-Labels, Einheiten-Tags.
- **Mono** (JetBrains Mono 500, 15px): Messwerte und Zähler.

### Named Rules
**Die Zahlen-zuerst-Regel.** Jeder Messwert (kg, Wdh., RPE, 1RM, Prozent) wird groß und in Anton oder Mono gesetzt, nie im Body-Stil versteckt. Die Zahl ist der Inhalt; das Label ist nur Beschriftung.

**Die Uppercase-nur-für-Display-Regel.** Großbuchstaben gehören Headlines und Pills (Beast Mode `upperHeads: true`). Fließtext bleibt gemischt; ALL-CAPS-Sätze sind verboten.

## 4. Elevation

Das System ist überwiegend **tonal geschichtet**, mit zurückhaltenden Schatten als Akzent. Tiefe entsteht primär aus der Helligkeitsstaffel `ink → surface → surface-2` plus Haarlinien-Border (eine 1px-Lichtkante oben in der Karte). Schatten sind weich, fast schwarz und dienen dem Abheben über dem dunklen Grund, nicht der Dramatik.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 30px -22px rgba(0,0,0,0.7)`): Standard-Karten. Inset-Lichtkante oben + tiefer, weit gestreuter Dunkelschatten.
- **Frame Lift** (`box-shadow: 0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)`): Der iPhone-Mockup-Rahmen, der über der Seite schwebt.
- **Ember Glow** (`box-shadow: 0 8px 24px -8px {accent}80`): Nur Primär-Buttons. Farbiger Schatten in der Akzentfarbe, der Wärme abstrahlt.

### Named Rules
**Die Glow-statt-Schlagschatten-Regel.** Hervorhebung im Dunkeln kommt aus farbigem Glow (Ember/Gold mit Transparenz) und der Helligkeitsstaffel, nicht aus harten grauen Schlagschatten. Schatten sind tief und weich, niemals scharf.

## 5. Components

### Buttons
- **Shape:** Abgerundet (`theme.radius`, 10px in Beast Mode). Padding `14px 22px`, Gewicht `weightHeavy` (800), in Beast Mode uppercase mit +1.2px Tracking.
- **Primary:** Ember-Fläche (`#FF4D14`) auf Ink-Text (`#0A0908`) plus Ember-Glow. Der eine laute Button pro Screen.
- **Secondary:** Surface-2-Fläche, Bone-Text, 1px Haarlinien-Border. Für gleichwertige Nebenaktionen.
- **Ghost:** Transparent, `mutedStrong`-Text. Für tertiäre Aktionen (Abbrechen, Überspringen).
- **Danger:** Transparent, roter Text, roter 25%-Border. Nur für zerstörende Aktionen.
- **Press:** Alle Buttons skalieren auf `scale(0.97)` beim Drücken (taktiles Feedback, 80ms).
- **Focus:** Gold-Outline (`2px solid #FFB020`, Offset 3px) über `:focus-visible`.

### Pills
- **Style:** Vollfarbig (Akzent + Ink-Text) oder getönt (Akzent bei 9% Deckkraft mit Akzent-Text). Radius 999px, 11px Label, uppercase, +0.6px Tracking.
- **State:** `fill`-Variante für aktive/wichtige Tags, getönt für ruhige Status-Marker.

### Cards / Containers
- **Corner Style:** `theme.radiusLg` (16px in Beast Mode).
- **Background:** Surface (`#15110E`).
- **Shadow Strategy:** Card Rest (siehe Elevation): Inset-Lichtkante + weicher Tiefenschatten.
- **Border:** 1px Haarlinie (`rgba(255,255,255,0.07)`).
- **Internal Padding:** typ. 16px. Klickbare Karten werden zu `<button>` mit `aria-label`.
- **Niemals verschachteln:** Karten in Karten sind verboten; nutze stattdessen Surface-2-Flächen oder Trennlinien.

### Inputs / Fields
- **Style:** Surface-2-Fläche, Haarlinien-Border, `theme.radius`. Zahlenfelder ohne native Spin-Buttons (per CSS entfernt).
- **Focus:** Gold-`:focus-visible`-Outline, identisch zu Buttons.

### Navigation
- **Style:** Screen-State in `useState` (kein Router); Wechsel über große, daumenfreundliche Buttons und Karten, nicht über eine klassische Tab-Bar. Der Start-Button auf Home pulsiert dezent (Ember-Glow) als primärer Einstieg.

### Signature Component: iPhone-Frame
Der `<Frame>` rendert die App in einem iPhone-Mockup: Statusleiste, Dynamic Island (110×32, schwarz), Home-Indicator (134×5, halbtransparent), Außenradius 36px, `Frame Lift`-Schatten. Safe-Area-Insets (`env(safe-area-inset-*)`) werden respektiert. Der Frame ist bewusster Teil der Identität, kein Debug-Wrapper.

## 6. Do's and Don'ts

### Do:
- **Do** den Hintergrund immer als radialen Ember-Verlauf setzen (`radial-gradient(ellipse at top, #1A0F0A 0%, #0A0908 65%)`), nie als plattes `#000`.
- **Do** pro Screen genau einen Ember-Primär-CTA leuchten lassen (Ein-Glut-Regel).
- **Do** Messwerte groß in Anton oder JetBrains Mono setzen; die Zahl ist der Held, das Label nur Beschriftung.
- **Do** neue Farben/Radii aus den Theme-Tokens ziehen (`theme.accent`, `theme.surface`, `theme.radius`), damit alle drei Themes konsistent bleiben.
- **Do** klickbare Karten als echte `<button>` mit `aria-label` rendern und den Gold-`:focus-visible`-Ring behalten.
- **Do** taktiles `scale(0.97)`-Press-Feedback auf interaktiven Elementen behalten.

### Don't:
- **Don't** generisch-SaaS bauen: keine hellgrauen Dashboards, keine blauen Default-Buttons, keine endlosen identischen Card-Grids.
- **Don't** verspielt/bunt werden: keine Gamification-Maskottchen, keine Pastell-Fun-Ästhetik, kein Konfetti als Motivation.
- **Don't** zwei Ember-Flächen gleichzeitig leuchten lassen; ein zweiter Akzent läuft über Gold oder Surface-2.
- **Don't** Karten in Karten verschachteln.
- **Don't** ALL-CAPS-Fließtext setzen; Großbuchstaben gehören nur Headlines und Pills.
- **Don't** harte graue Schlagschatten verwenden; Hervorhebung im Dunkeln kommt aus farbigem Glow und der Helligkeitsstaffel.
- **Don't** Verhalten zwischen Themes ändern; ein Theme ist eine Haut, kein anderer Flow.
