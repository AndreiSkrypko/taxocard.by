# Сверяет embed Bitrix на taxocard.by с эталоном taxocard.backup.
# Настройки формы живут в loader_*.js (скачаны с CDN backup); в HTML только click/ID/sec.
$ErrorActionPreference = 'Stop'
$backupRoot = 'C:\Users\sundonk\.cursor\taxocard.backup'
$siteRoot = Split-Path $PSScriptRoot -Parent

function Get-B24Embeds($htmlPath) {
  $c = [IO.File]::ReadAllText($htmlPath)
  [regex]::Matches($c, 'data-b24-form="(click/\d+/[a-z0-9]+)"[^>]*>[\s\S]*?loader_(\d+)\.js') | ForEach-Object {
    [pscustomobject]@{
      Form = $_.Groups[1].Value
      Loader = "loader_$($_.Groups[2].Value).js"
      File = Split-Path $htmlPath -Leaf
    }
  }
}

$backupFiles = Get-ChildItem (Join-Path $backupRoot '*.html') | ForEach-Object { $_.Name }
$rows = @()
foreach ($name in $backupFiles) {
  $bp = Join-Path $backupRoot $name
  $sp = Join-Path $siteRoot $name
  if (-not (Test-Path $sp)) { continue }
  $b = Get-B24Embeds $bp | Group-Object Form | ForEach-Object { "$($_.Name):$($_.Count)" }
  $s = Get-B24Embeds $sp | Group-Object Form | ForEach-Object { "$($_.Name):$($_.Count)" }
  $diff = Compare-Object $b $s
  if ($diff) {
    Write-Host "`n=== $name ===" -ForegroundColor Yellow
    Write-Host "backup: $($b -join ', ')"
    Write-Host "site:   $($s -join ', ')"
  }
}
Write-Host "`nГотово. Один embed на форму на странице — как в backup."
