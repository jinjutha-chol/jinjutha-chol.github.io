# Publishes content changes to the live site.
# Checks the site still builds BEFORE publishing, so a mistake can't take the site down.
# This is the Windows counterpart to publish.sh (used by make-launchers.ps1).
Set-Location $PSScriptRoot

function Finish([int]$Code = 0) {
  Write-Host ""
  Read-Host "Press Enter to close" | Out-Null
  exit $Code
}

function Fail($Message) {
  Write-Host ""
  Write-Host "  x $Message" -ForegroundColor Red
  Finish 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail "Git is not installed on this computer."
}

# Node on PATH already? Otherwise look in the usual install spots, including
# fnm (https://github.com/Schniz/fnm), a common no-admin way to install Node.
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  $fnmRoot = "$env:APPDATA\fnm\node-versions"
  if (Test-Path $fnmRoot) {
    $latest = Get-ChildItem $fnmRoot -Directory -ErrorAction SilentlyContinue |
      Sort-Object Name -Descending | Select-Object -First 1
    if ($latest -and (Test-Path (Join-Path $latest.FullName "installation\node.exe"))) {
      $env:PATH = (Join-Path $latest.FullName "installation") + ";" + $env:PATH
    }
  }
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Fail "Node.js is not installed on this computer. Ask whoever set this up to install it."
}

# 1. Is there anything to publish?
$status = git status --porcelain
if (-not $status) {
  Write-Host ""
  Write-Host "  Nothing to publish - no changes since last time."
  Finish 0
}

Write-Host ""
Write-Host "  Changes found:"
($status -split "`r?`n") | ForEach-Object { Write-Host "    $_" }
Write-Host ""

# 2. Is a GitHub repo connected? Checked before the build so this fails fast.
git remote get-url origin *> $null
if ($LASTEXITCODE -ne 0) {
  Fail "No GitHub repository is connected yet. Ask whoever set this up to finish it."
}

# 3. Make sure it still builds. Never push a site that won't build.
Write-Host "  Checking the site builds..."
npm run build *> .build.log
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "  x The site did not build, so nothing was published."
  Write-Host "    Your changes are safe on this computer. Details:"
  Write-Host ""
  if (Test-Path ".build.log") {
    Get-Content ".build.log" -Tail 20 | ForEach-Object { Write-Host "    $_" }
  }
  Finish 1
}
Write-Host "  v Builds fine." -ForegroundColor Green

# 4. Save and upload.
Write-Host "  Publishing..."
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "  Nothing to publish - the changes were only to files that aren't part of the site."
  Finish 0
}

$commitMessage = "Update site content - $(Get-Date -Format 'dd MMM yyyy, HH:mm')"
git commit -q -m $commitMessage
if ($LASTEXITCODE -ne 0) { Fail "Could not save the changes." }

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
git rev-parse --abbrev-ref --symbolic-full-name '@{u}' *> $null
if ($LASTEXITCODE -eq 0) {
  git push -q
} else {
  # Very first publish: no upstream is set yet, so plain `git push` would fail.
  git push -q -u origin $branch
}
if ($LASTEXITCODE -ne 0) {
  Fail "Could not upload. Check your internet connection, then try again."
}

Write-Host ""
Write-Host "  v Published. The live site updates in a minute or two." -ForegroundColor Green
Finish 0
