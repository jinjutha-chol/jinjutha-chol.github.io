#!/usr/bin/env bash
# Run this ONCE on the machine of whoever will edit the content.
# It puts two double-clickable icons on their Desktop: Edit Website, Publish Website.
set -euo pipefail
PROJECT="$(cd "$(dirname "$0")" && pwd)"

DESKTOP="$(xdg-user-dir DESKTOP 2>/dev/null || true)"
[ -z "$DESKTOP" ] && DESKTOP="$HOME/Desktop"
mkdir -p "$DESKTOP"

# Path= sets the working directory, so Exec needs no `cd`. That matters:
# `'` and `&` are reserved characters in an Exec line and make it invalid.
make_launcher() {
  local file="$DESKTOP/$1.desktop" name="$2" script="$3" icon="$4" comment="$5"
  cat > "$file" <<EOF
[Desktop Entry]
Type=Application
Version=1.0
Name=$name
Comment=$comment
Exec="$PROJECT/$script"
Path=$PROJECT
Icon=$icon
Terminal=true
Categories=Utility;
EOF
  chmod +x "$file"
  # GNOME requires launchers be explicitly trusted before they will run.
  gio set "$file" metadata::trusted true 2>/dev/null || true
  echo "  ✓ $file"
}

echo "Creating launchers on the Desktop..."
make_launcher "Edit Website"    "Edit Website"    "start-editor.sh" "accessories-text-editor" "Open the website content editor"
make_launcher "Publish Website" "Publish Website" "publish.sh"      "network-transmit"        "Put content changes on the live site"

echo
echo "Done. If double-clicking asks, choose 'Trust and Launch'."
