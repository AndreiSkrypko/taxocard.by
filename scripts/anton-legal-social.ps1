$root = "c:\Users\sundonk\.cursor\taxocard.by"
$utf8 = New-Object System.Text.UTF8Encoding($false)
$paths = @(Get-ChildItem $root -Filter *.html -File) + (Get-Item "$root\partials\social-section.snippet.html")

foreach ($file in $paths) {
  if (-not (Test-Path $file.FullName)) { continue }
  $t = [IO.File]::ReadAllText($file.FullName, $utf8)
  $o = $t

  $t = $t.Replace('сервисная компания, не госорган', 'сервисная компания, не является государственным органом')
  $t = $t.Replace('более 8 лет', 'более 4 лет')
  $t = $t.Replace('Более 8 лет', 'Более 4 лет')

  $t = $t -replace '\r?\n\s*"https://www\.youtube\.com/@taxocard",', ''
  $t = $t -replace '\r?\n\s*"https://www\.tiktok\.com/@taxo\.card",', ''

  $t = [regex]::Replace($t, '\r?\n\s*<a href="https://www\.youtube\.com/@taxocard"[^>]*>.*?</a>', '')
  $t = [regex]::Replace($t, '\r?\n\s*<a href="https://www\.tiktok\.com/@taxo\.card"[^>]*>.*?</a>', '')

  $t = [regex]::Replace($t, '(?s)\r?\n\s*<a class="social-tile social-tile--youtube[^>]*>.*?</a>', '')
  $t = [regex]::Replace($t, '(?s)\r?\n\s*<a class="social-tile social-tile--tiktok[^>]*>.*?</a>', '')

  $t = $t -replace '\r?\narrgetbtn\.push\(\{"title":"YouTube"[^\r\n]+\);', ''

  if ($t -ne $o) {
    [IO.File]::WriteAllText($file.FullName, $t, $utf8)
    Write-Host "OK: $($file.Name)"
  }
}
