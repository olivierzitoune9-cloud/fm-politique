$ErrorActionPreference = 'Stop'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
$log = Join-Path $PSScriptRoot '_polices.log'
Remove-Item $log -ErrorAction SilentlyContinue
$dir = Join-Path $PSScriptRoot 'ui\app\polices'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$url = 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=Public+Sans:wght@400;500;600;700&display=swap'
$css = (Invoke-WebRequest -Uri $url -UserAgent $ua -UseBasicParsing).Content
Add-Content $log "CSS_OK $($css.Length) octets"

foreach ($seg in ($css -split '/\*')) {
  if ($seg -notmatch 'font-family') { continue }
  $sub = ($seg -split '\*/')[0].Trim()
  if ($sub -ne 'latin') { continue }
  $fam = [regex]::Match($seg, "font-family:\s*'([^']+)'").Groups[1].Value
  $sty = [regex]::Match($seg, 'font-style:\s*([a-z]+)').Groups[1].Value
  $wgt = [regex]::Match($seg, 'font-weight:\s*([0-9 ]+)').Groups[1].Value.Trim()
  $u = [regex]::Match($seg, 'url\((https://[^)]+)\)').Groups[1].Value
  if ($fam -eq '' -or $u -eq '') { continue }
  $nom = (($fam -replace '\s', '') + '-' + $sty + '-' + ($wgt -replace ' ', '-') + '.woff2')
  $dest = Join-Path $dir $nom
  Invoke-WebRequest -Uri $u -OutFile $dest -UserAgent $ua
  Add-Content $log "OK $nom $((Get-Item $dest).Length) octets"
}

foreach ($p in @(
  @{u = 'https://raw.githubusercontent.com/productiontype/Spectral/master/ofl.txt'; f = 'OFL-Spectral.txt'},
  @{u = 'https://raw.githubusercontent.com/uswds/public-sans/develop/OFL.txt'; f = 'OFL-PublicSans.txt'}
)) {
  try {
    Invoke-WebRequest -Uri $p.u -OutFile (Join-Path $dir $p.f) -UserAgent $ua
    Add-Content $log "LICENCE_OK $($p.f)"
  } catch {
    Add-Content $log "LICENCE_KO $($p.f) $($_.Exception.Message)"
  }
}

Add-Content $log 'FINI'