$ErrorActionPreference = "Stop"

$BuildSyncOrigin = if ($env:BUILD_SYNC_BASE_URL) { $env:BUILD_SYNC_BASE_URL } else { "https://build-system-three.vercel.app" }
$Node = Get-Command node -ErrorAction SilentlyContinue
if (-not $Node) {
  throw "BUILD Sync nécessite Node.js 20 ou plus récent."
}

$NodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
if ($NodeMajor -lt 20) {
  throw "BUILD Sync nécessite Node.js 20 ou plus récent."
}

$InstallRoot = Join-Path $env:LOCALAPPDATA "BUILD Sync"
$BinRoot = Join-Path $InstallRoot "bin"
$CliPath = Join-Path $InstallRoot "build.mjs"
$TempPath = "$CliPath.tmp"
New-Item -ItemType Directory -Force -Path $InstallRoot, $BinRoot | Out-Null
Invoke-WebRequest -UseBasicParsing "$BuildSyncOrigin/build-sync/build.mjs" -OutFile $TempPath
Move-Item -Force $TempPath $CliPath

$Wrapper = Join-Path $BinRoot "build-skills.cmd"
Set-Content -Encoding Ascii -Path $Wrapper -Value "@echo off`r`n`"$($Node.Source)`" `"$CliPath`" %*`r`n"

if ($env:BUILD_SYNC_INSTALL_ONLY -ne "1") {
  & $Node.Source $CliPath skills setup "--base-url=$BuildSyncOrigin"
}
Write-Host "BUILD Sync est installé. Commande disponible : $Wrapper"
