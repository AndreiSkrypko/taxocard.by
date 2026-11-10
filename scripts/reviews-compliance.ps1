$root = Split-Path $PSScriptRoot -Parent
$utf8 = New-Object System.Text.UTF8Encoding($false)
$paths = @(Get-ChildItem $root -Filter *.html -File) + @(Get-Item "$root\partials\brands-reviews-kod.snippet.html" -ErrorAction SilentlyContinue)
$pairs = @(
  @(
    'Добрый день, хочу поблагодарить команду Taxo Card. Не первый раз обращаюсь за изготовлением Чип-карта тахографа.',
    'Добрый день, хочу поблагодарить команду TaxoCARD. Не первый раз обращаюсь за сопровождением при получении чип-карты тахографа.'
  ),
  @(
    'Закончился срок действия чип карты вдителя. По рекомендации обратился с целью оказания помощи в изготовлении чипа польской транспортной инспекции. Не пожалел.',
    'Закончился срок действия чип-карты водителя. По рекомендации обратился за помощью в сопровождении получения чип-карты через польское уполномоченное учреждение. Не пожалел.'
  )
)

foreach ($file in $paths) {
  if (-not $file) { continue }
  $t = [IO.File]::ReadAllText($file.FullName, $utf8)
  $o = $t
  foreach ($pair in $pairs) {
    $t = $t.Replace($pair[0], $pair[1])
  }
  if ($t -ne $o) {
    [IO.File]::WriteAllText($file.FullName, $t, $utf8)
    Write-Host "OK: $($file.Name)"
  }
}
