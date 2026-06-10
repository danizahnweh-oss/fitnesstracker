#!/bin/bash
# Production build: bundles React and compiles JSX ahead of time with Vite.
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "node_modules fehlt. Bitte zuerst ausführen: npm install"
  exit 1
fi

npm run build
