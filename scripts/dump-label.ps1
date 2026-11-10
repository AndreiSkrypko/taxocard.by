$utf8 = New-Object System.Text.UTF8Encoding($false)
$t = [IO.File]::ReadAllText('c:\Users\sundonk\.cursor\taxocard.by\index.html', $utf8)
$i = $t.IndexOf('>Ч')
$snippet = $t.Substring($i, 40)
$snippet.ToCharArray() | ForEach-Object { '{0:X4}' -f [int][char]$_ }
