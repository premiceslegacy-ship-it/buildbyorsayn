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
Set-Content -Encoding Ascii -Path $Wrapper -Value "@echo off`r`nset `"BUILD_SYNC_CLI_PATH=$CliPath`"`r`n`"$($Node.Source)`" `"$CliPath`" %*`r`n"

if ($env:BUILD_SYNC_INSTALL_ONLY -ne "1") {
  & $Node.Source $CliPath skills setup "--base-url=$BuildSyncOrigin"
}
Write-Host "✓ Commande disponible : $Wrapper"

# La synchronisation planifiée utilise le chemin complet ; la commande tapée à la main a besoin du PATH.
# On l'ajoute au PATH de l'utilisateur une seule fois (BUILD_SYNC_NO_PROFILE=1 pour ne pas y toucher).
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
$UserPathEntries = @($UserPath -split ";" | Where-Object { $_ })
if ($UserPathEntries -notcontains $BinRoot) {
  if ($env:BUILD_SYNC_NO_PROFILE -eq "1") {
    Write-Host "→ $BinRoot n'est pas dans ton PATH (laissé intact, BUILD_SYNC_NO_PROFILE=1)."
  } else {
    [Environment]::SetEnvironmentVariable("Path", (($UserPathEntries + $BinRoot) -join ";"), "User")
    Write-Host "✓ $BinRoot ajouté à ton PATH. Les nouveaux terminaux trouveront build-skills."
  }
}
if (($env:Path -split ";") -notcontains $BinRoot) { $env:Path = "$env:Path;$BinRoot" }
