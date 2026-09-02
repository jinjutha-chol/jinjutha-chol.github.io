#!/usr/bin/env bash
# Starts the content editor and opens it in the browser.
# Safe to run again — if it's already running it just reopens the tab.
set -uo pipefail
cd "$(dirname "$0")" || exit 1

URL="http://localhost:4321/keystatic"

fail() {
  echo
  echo "  ✗ $1"
  echo
  read -r -p "Press Enter to close." _
  exit 1
}

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js is not installed on this computer. Ask whoever set this up to install it."
fi

if [ ! -d node_modules ]; then
  echo "  First time running this — setting up. This takes a minute or two..."
  npm install --silent || fail "Setup failed. Check your internet connection and try again."
fi

# Already up? Skip straight to opening it.
if ! curl -sf -o /dev/null --max-time 2 "$URL"; then
  echo "  Starting the editor..."
  npm run dev >.editor.log 2>&1
  if ! curl -sf -o /dev/null --retry 30 --retry-all-errors --retry-delay 1 --max-time 60 "$URL"; then
    echo
    echo "  ✗ The editor did not start. Details:"
    tail -n 20 .editor.log
    echo
    read -r -p "Press Enter to close." _
    exit 1
  fi
fi

echo
echo "  ✓ Editor is running."
echo
echo "    Edit content:  $URL"
echo "    Preview site:  http://localhost:4321"
echo
echo "    When you're finished, run Publish to put your changes online."
echo

# Open in the default browser, quietly, on whichever platform this is.
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 &
fi

read -r -p "Press Enter to close this window (the editor keeps running)." _
