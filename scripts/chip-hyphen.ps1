$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$nb = [char]0x2011
$chip = 'Чип' + $nb + 'карта'
$replaces = @(
  @('Чип-карта тахографа', ($chip + ' тахографа')),
  @('Чип-карта для автобусов', ($chip + ' для автобусов')),
  @('Чип карта тахографа', ($chip + ' тахографа')),
  @('Чипкарта тахографа', ($chip + ' тахографа')),
  @('Чип-карта для бусов', ($chip + ' для автобусов'))
)
Get-ChildItem $root -Filter *.html -File | ForEach-Object {
  $t = [IO.File]::ReadAllText($_.FullName, $utf8)
  $o = $t
  foreach ($pair in $replaces) { $t = $t.Replace($pair[0], $pair[1]) }
  if ($t -ne $o) {
    [IO.File]::WriteAllText($_.FullName, $t, $utf8)
    Write-Host $_.Name
  }
}
