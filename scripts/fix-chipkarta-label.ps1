$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$from = [string]::Concat(
  [char]0x0427, [char]0x0438, [char]0x043F, [char]0x043A, [char]0x0430, [char]0x0440, [char]0x0442, [char]0x0430,
  ' ',
  [char]0x0442, [char]0x0430, [char]0x0445, [char]0x043E, [char]0x0433, [char]0x0440, [char]0x0430, [char]0x0444, [char]0x0430
)
$to = [string]::Concat(
  [char]0x0427, [char]0x0438, [char]0x043F, '-', [char]0x043A, [char]0x0430, [char]0x0440, [char]0x0442, [char]0x0430,
  ' ',
  [char]0x0442, [char]0x0430, [char]0x0445, [char]0x043E, [char]0x0433, [char]0x0440, [char]0x0430, [char]0x0444, [char]0x0430
)

Get-ChildItem $root -Filter *.html -File | ForEach-Object {
  $t = [IO.File]::ReadAllText($_.FullName, $utf8)
  if ($t.Contains($from)) {
    $t = $t.Replace($from, $to)
    [IO.File]::WriteAllText($_.FullName, $t, $utf8)
    Write-Host "OK: $($_.Name)"
  }
}
