$root = Split-Path $PSScriptRoot -Parent
$script17 = @'
<script data-b24-form="click/17/vqtplx" data-skip-moving="true">(function(w,d,u){var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);})(window,document,'https://cdn-ru.bitrix24.by/b27507608/crm/form/loader_17.js');</script>
'@

Get-ChildItem -Path $root -Filter '*.html' | ForEach-Object {
  $path = $_.FullName
  $c = [IO.File]::ReadAllText($path)

  $c = [regex]::Replace(
    $c,
    '(?is)<a\s+([^>]*?)\sdata-b24-zayavka\s*([^>]*?)>(.*?)</a>',
    {
      param($m)
      $attrs = ($m.Groups[1].Value.Trim() + ' ' + $m.Groups[2].Value.Trim()).Trim() -replace '\s+', ' '
      return '<div class="b24">' + $script17 + '<a ' + $attrs + '>' + $m.Groups[3].Value + '</a></div>'
    }
  )

  $c = [regex]::Replace(
    $c,
    '(?is)\s*<div id="b24-zayavka-sink"[^>]*>.*?</div>\s*',
    "`n"
  )

  $c = $c -replace 'site\.js\?v=[^"]+', 'site.js?v=b24-backup'

  [IO.File]::WriteAllText($path, $c)
  Write-Host "OK $($_.Name)"
}
