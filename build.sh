#!/bin/bash
# Builds index.html with all scripts inlined for static hosting (GitHub Pages)
set -e
cd "$(dirname "$0")"

cat > index.html <<'HEADER'
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Fitnesstracker</title>
  <meta name="theme-color" content="#0A0908">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    html, body, #root { margin: 0; padding: 0; height: 100%; }
    body {
      background: #0A0908;
      color: #f3efe8;
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
    }
    * { box-sizing: border-box; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none; margin: 0;
    }
    input[type=number] { -moz-appearance: textfield; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 8px 24px -8px var(--pulse-color, rgba(255,77,20,0.5)); }
      50% { transform: scale(1.015); box-shadow: 0 12px 32px -8px var(--pulse-color, rgba(255,77,20,0.7)); }
    }
    @supports (padding: env(safe-area-inset-top)) {
      :root {
        --sat: env(safe-area-inset-top, 0px);
        --sab: env(safe-area-inset-bottom, 0px);
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
HEADER

# Inline vanilla JS files
for f in lib.js themes.js; do
  echo "  <script>" >> index.html
  cat "$f" >> index.html
  echo -e "\n  </script>" >> index.html
done

# Inline JSX files (Babel-compiled in browser)
for f in tweaks-panel.jsx app-home.jsx app-workout.jsx app-workout-card.jsx \
         app-workout-rest.jsx app-stats.jsx app-settings.jsx app-plates.jsx \
         app-recovery.jsx app-coach.jsx app-main.jsx canvas.jsx; do
  echo "  <script type=\"text/babel\">" >> index.html
  cat "$f" >> index.html
  echo -e "\n  </script>" >> index.html
done

echo "</body></html>" >> index.html
echo "Built index.html ($(wc -c < index.html | tr -d ' ') bytes)"
