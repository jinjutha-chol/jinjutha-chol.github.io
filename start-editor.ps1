# Starts the content editor and opens it in the browser.
# Safe to run again -- if it's already running it just reopens the tab.
# This is the Windows counterpart to start-editor.sh (used by make-launchers.ps1).
Set-Location $PSScriptRoot

$Url = "http://localhost:4321/keystatic"
$PreviewUrl = "http://localhost:4321"
# PowerShell's Invoke-WebRequest tries ::1 before falling back to 127.0.0.1,
# which can take a couple of seconds per call and make the checks below
# needlessly slow -- so health-checks hit the IPv4 address directly.
$CheckUrl = "http://127.0.0.1:4321/keystatic"

function Fail($Message) {
  Write-Host ""
  Write-Host "  x $Message" -ForegroundColor Red
  Write-Host ""
  Read-Host "Press Enter to close" | Out-Null
  exit 1
}

# Node on PATH already? Otherwise look in the usual install spots, including
# fnm (https://github.com/Schniz/fnm), a common no-admin way to install Node.
function Find-NodeDir {
  if (Get-Command node -ErrorAction SilentlyContinue) { return $null }
  $candidates = @("$env:ProgramFiles\nodejs", "${env:ProgramFiles(x86)}\nodejs")
  $fnmRoot = "$env:APPDATA\fnm\node-versions"
  if (Test-Path $fnmRoot) {
    $latest = Get-ChildItem $fnmRoot -Directory -ErrorAction SilentlyContinue |
      Sort-Object Name -Descending | Select-Object -First 1
    if ($latest) { $candidates += (Join-Path $latest.FullName "installation") }
  }
  foreach ($dir in $candidates) {
    if (Test-Path (Join-Path $dir "node.exe")) { return $dir }
  }
  return $null
}

$nodeDir = Find-NodeDir
if ($nodeDir) { $env:PATH = "$nodeDir;$env:PATH" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Fail "Node.js is not installed on this computer. Ask whoever set this up to install it."
}

function Test-EditorUp {
  try {
    Invoke-WebRequest -UseBasicParsing -Uri $CheckUrl -TimeoutSec 3 | Out-Null
    return $true
  } catch {
    return $false
  }
}

if (-not (Test-Path "node_modules")) {
  Write-Host "  First time running this - setting up. This takes a minute or two..."
  npm install --silent
  if ($LASTEXITCODE -ne 0) { Fail "Setup failed. Check your internet connection and try again." }
}

# Already up? Skip straight to opening it.
if (-not (Test-EditorUp)) {
  Write-Host "  Starting the editor..."
  # astro dev forks itself into a background process and returns, so this
  # does not block -- no extra backgrounding needed. --host 127.0.0.1 avoids
  # ambiguity between the IPv6 and IPv4 loopback addresses.
  npx astro dev --host 127.0.0.1 *> .editor.log

  $ok = $false
  for ($i = 0; $i -lt 60; $i++) {
    if (Test-EditorUp) { $ok = $true; break }
    Start-Sleep -Seconds 1
  }
  if (-not $ok) {
    Write-Host ""
    Write-Host "  x The editor did not start. Details:"
    if (Test-Path ".editor.log") { Get-Content ".editor.log" -Tail 20 }
    Write-Host ""
    Read-Host "Press Enter to close" | Out-Null
    exit 1
  }
}

$Rule = "  " + ("-" * 62)

Write-Host ""
Write-Host $Rule
Write-Host ""
Write-Host "   The editor is running." -ForegroundColor Green
Write-Host ""
Write-Host "   Open this link to edit the website:"
Write-Host ""
Write-Host "       $Url" -ForegroundColor Cyan
Write-Host ""
Write-Host "   To preview the site itself:"
Write-Host ""
Write-Host "       $PreviewUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host $Rule
Write-Host ""
Write-Host "   When you are finished editing, run Publish to put the"
Write-Host "   changes online."
Write-Host ""

try {
  # Routed through `cmd /c start` rather than Start-Process directly -- more
  # reliable for opening a URL in the default browser when this script itself
  # runs non-interactively (e.g. launched from a Desktop shortcut).
  Start-Process -FilePath "cmd.exe" -ArgumentList '/c', 'start', '""', $Url -WindowStyle Hidden -ErrorAction Stop
} catch {
  Write-Host "   (Could not open a browser automatically -- use the link above.)"
  Write-Host ""
}

Read-Host "   Press Enter to close this window. The editor keeps running" | Out-Null
