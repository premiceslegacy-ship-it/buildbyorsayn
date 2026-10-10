$ErrorActionPreference = "Stop"

$BuildSyncOrigin = if ($env:BUILD_SYNC_BASE_URL) { $env:BUILD_SYNC_BASE_URL } else { "https://build-system-three.vercel.app" }
Write-Host ""
Write-Host "BUILD Sync - préparation de l'installation"
Write-Host ""
$Node = Get-Command node -ErrorAction SilentlyContinue
if (-not $Node) {
  throw "Node.js n'est pas installé. Installe Node.js 20 ou plus récent depuis https://nodejs.org puis relance cette commande."
}

$NodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
if ($NodeMajor -lt 20) {
  $NodeVersion = & node -v
  throw "Ta version de Node.js est trop ancienne ($NodeVersion). Installe Node.js 20 ou plus récent depuis https://nodejs.org puis relance cette commande."
}

Write-Host "✓ Node.js $(& node -v)"
Write-Host "→ Téléchargement sécurisé de BUILD Sync..."

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
Write-Host "✓ Commande disponible : $Wrapper"
