$dst = Join-Path (Split-Path $PSScriptRoot -Parent) 'assets\bitrix\crm\form'
$src = 'C:\Users\sundonk\.cursor\projects\c-Users-sundonk-cursor-taxocard-by\agent-tools'
$map = @{
  'acc68899-e131-4729-bc4a-23ed1c0cc6de.txt' = 'loader_1.js'
  'deed3bfb-a4ce-4c4b-9e58-949a8642256c.txt'  = 'loader_7.js'
  'f241454c-8730-407b-bb1f-975350c406be.txt'  = 'loader_9.js'
  '2e0e2ed5-5fc9-40dd-a01e-792f6da38454.txt'  = 'loader_11.js'
  'ec9f8d22-a309-4b06-9d7d-5ecb3baf5760.txt'  = 'loader_13.js'
  '5216c8af-da80-439f-9afa-c7b2c4438725.txt'  = 'loader_15.js'
  'cb0b3447-055d-4c33-a7f1-89bcfad1d694.txt'  = 'loader_17.js'
  'ebbad100-4038-4370-8aee-535eddbbfea6.txt'  = 'loader_19.js'
  '4f0f2071-329e-43e2-bfb3-d75e6538b648.txt'  = 'loader_21.js'
  'a6fdf700-cd77-4228-817c-bcc95b879ce2.txt'  = 'loader_23.js'
  '352860b5-6b66-48d6-873e-a488142cae58.txt'  = 'app.js'
  '8851347c-3ca0-4415-8d2b-8dd076a9d5ac.txt'  = 'polyfill.js'
}

New-Item -ItemType Directory -Force -Path $dst | Out-Null
foreach ($e in $map.GetEnumerator()) {
  $from = Join-Path $src $e.Key
  if (-not (Test-Path $from)) { Write-Warning "Missing $from"; continue }
  Copy-Item $from (Join-Path $dst $e.Value) -Force
  Write-Host "Installed $($e.Value)"
}

# JSON in loader embed uses \/ escapes (same as original CDN paths).
$localAppJson = '\/assets\/bitrix\/crm\/form\/app.js'
$localPolyJson = '\/assets\/bitrix\/crm\/form\/polyfill.js'
Get-ChildItem (Join-Path $dst 'loader_*.js') | ForEach-Object {
  $c = [IO.File]::ReadAllText($_.FullName)
  $c = $c -replace 'https:\\/\\/cdn-ru\.bitrix24\.by\\/b27507608\\/crm\\/form\\/app\.js', $localAppJson
  $c = $c -replace 'https:\\/\\/cdn-ru\.bitrix24\.by\\/b27507608\\/crm\\/form\\/polyfill\.js', $localPolyJson
  # Fix double-escaped paths from older script versions
  $c = $c.Replace('"app":"\\/assets\\/bitrix\\/crm\\/form\\/app.js"', '"app":"\/assets\/bitrix\/crm\/form\/app.js"')
  $c = $c.Replace('"polyfill":"\\/assets\\/bitrix\\/crm\\/form\\/polyfill.js"', '"polyfill":"\/assets\/bitrix\/crm\/form\/polyfill.js"')
  [IO.File]::WriteAllText($_.FullName, $c)
}

$root = Split-Path $PSScriptRoot -Parent
Get-ChildItem (Join-Path $root '*.html') | ForEach-Object {
  $c = [IO.File]::ReadAllText($_.FullName)
  $c = $c.Replace(
    'https://cdn-ru.bitrix24.by/b27507608/crm/form/',
  'assets/bitrix/crm/form/'
  )
  $c = $c -replace 'site\.js\?v=[^"]+', 'site.js?v=b24-local'
  [IO.File]::WriteAllText($_.FullName, $c)
}

Write-Host 'Done. Bitrix form scripts are served locally.'
