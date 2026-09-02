#!/usr/bin/env bash
# Publishes content changes to the live site.
# Checks the site still builds BEFORE publishing, so a mistake can't take the site down.
set -uo pipefail
cd "$(dirname "$0")" || exit 1

finish() {
  echo
  read -r -p "Press Enter to close." _
  exit "${1:-0}"
}

fail() {
  echo
  echo "  ✗ $1"
  finish 1
}

command -v git >/dev/null 2>&1 || fail "Git is not installed on this computer."

# 1. Is there anything to publish?
if [ -z "$(git status --porcelain)" ]; then
  echo
  echo "  Nothing to publish — no changes since last time."
  finish 0
fi

echo
echo "  Changes found:"
git status --porcelain | sed 's/^/    /'
echo

# 2. Is a GitHub repo connected? Checked before the build so this fails fast.
if ! git remote get-url origin >/dev/null 2>&1; then
  fail "No GitHub repository is connected yet. Ask whoever set this up to finish it."
fi

# 3. Make sure it still builds. Never push a site that won't build.
echo "  Checking the site builds..."
if ! npm run build >.build.log 2>&1; then
  echo
  echo "  ✗ The site did not build, so nothing was published."
  echo "    Your changes are safe on this computer. Details:"
  echo
  tail -n 20 .build.log | sed 's/^/    /'
  finish 1
fi
echo "  ✓ Builds fine."

# 4. Save and upload.
echo "  Publishing..."
git add -A
if git diff --cached --quiet; then
  echo
  echo "  Nothing to publish — the changes were only to files that aren't part of the site."
  finish 0
fi

git commit -q -m "Update site content — $(date '+%d %b %Y, %H:%M')" || fail "Could not save the changes."

branch="$(git rev-parse --abbrev-ref HEAD)"
if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  push_ok=$(git push -q 2>&1) || fail "Could not upload. Check your internet connection, then try again.${push_ok:+ ($push_ok)}"
else
  # Very first publish: no upstream is set yet, so plain `git push` would fail.
  push_ok=$(git push -q -u origin "$branch" 2>&1) || fail "Could not upload. Check your internet connection, then try again.${push_ok:+ ($push_ok)}"
fi

echo
echo "  ✓ Published. The live site updates in a minute or two."
finish 0
