# Run this ONCE on the machine of whoever will edit the content.
# It puts two double-clickable icons on their Desktop: Edit Website, Publish Website.
# This is the Windows counterpart to make-launchers.sh.
$ErrorActionPreference = "Stop"
$Project = $PSScriptRoot
$Desktop = [Environment]::GetFolderPath("Desktop")

function New-Launcher {
  param($Name, $Script)
  $lnkPath = Join-Path $Desktop "$Name.lnk"
  $wsh = New-Object -ComObject WScript.Shell
  $shortcut = $wsh.CreateShortcut($lnkPath)
  $shortcut.TargetPath = "powershell.exe"
  # -ExecutionPolicy Bypass applies only to this one invocation, not the
  # whole machine, so it needs no admin rights and changes no settings.
  $shortcut.Arguments = "-NoLogo -ExecutionPolicy Bypass -File `"$Project\$Script`""
  $shortcut.WorkingDirectory = $Project
  $shortcut.Description = $Name
  $shortcut.Save()
  Write-Host "  + $lnkPath"
}

Write-Host "Creating launchers on the Desktop..."
New-Launcher "Edit Website" "start-editor.ps1"
New-Launcher "Publish Website" "publish.ps1"

Write-Host ""
Write-Host "Done."
