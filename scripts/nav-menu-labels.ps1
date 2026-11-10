$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$replaces = @(
  @('Чипkарта тахографа', 'Чип-карта тахографа'),
  @('Чип-карта для бусов', 'Чип-карта для автобусов'),
  @('для бусов и грузовиков', 'для автобусов и грузовиков'),
  @('Юр.лицам', 'Юридическим лицам')
)

Get-ChildItem $root -Filter *.html -File | ForEach-Object {
  $t = [IO.File]::ReadAllText($_.FullName, $utf8)
  $o = $t
  foreach ($pair in $replaces) {
    $t = $t.Replace($pair[0], $pair[1])
  }
  if ($t -ne $o) {
    [IO.File]::WriteAllText($_.FullName, $t, $utf8)
    Write-Host "OK: $($_.Name)"
  }
}
