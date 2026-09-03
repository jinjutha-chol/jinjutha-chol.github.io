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

# Colour only when writing to a real terminal, so piping stays clean.
if [ -t 1 ]; then
  B=$(printf '\033[1m'); U=$(printf '\033[1;4;36m'); D=$(printf '\033[2m'); R=$(printf '\033[0m')
else
  B=""; U=""; D=""; R=""
fi
RULE="  ────────────────────────────────────────────────────────────"

echo
echo "$D$RULE$R"
echo
echo "   ${B}✓  The editor is running.${R}"
echo
echo "   Open this link to edit the website:"
echo
echo "       ${U}${URL}${R}"
echo
echo "   To preview the site itself:"
echo
echo "       ${U}http://localhost:4321${R}"
echo
echo "$D$RULE$R"
echo
echo "   ${D}Ctrl+click a link, or copy it into your browser.${R}"
echo "   ${D}When you are finished editing, run Publish to put the${R}"
echo "   ${D}changes online.${R}"
echo

# Try to open the browser too. If there is no opener, the link above is still
# on screen, so say so rather than failing silently.
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 &
else
  echo "   ${D}(Could not open a browser automatically — use the link above.)${R}"
  echo
fi

read -r -p "   Press Enter to close this window. The editor keeps running. " _
