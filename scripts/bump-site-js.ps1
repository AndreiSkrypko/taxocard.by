$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem $root -Filter *.html -File | ForEach-Object {
  $t = [IO.File]::ReadAllText($_.FullName, $utf8)
  $n = [regex]::Replace($t, 'assets/js/site\.js\?v=[^\s"]+', 'assets/js/site.js?v=b24-click')
  if ($n -ne $t) {
    [IO.File]::WriteAllText($_.FullName, $n, $utf8)
    Write-Host $_.Name
  }
}
