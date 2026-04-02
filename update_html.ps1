$html = Get-Content -Path "index.html" -Raw

$html = $html -replace 'src="data:image/[^;]+;base64,[^"]+"\s+alt="Logo Kiaçaí"', 'src="logo.jpg" alt="Logo Kiaçaí"'
$html = $html -replace 'class="bottle-img"\s+src="data:image/[^;]+;base64,[^"]+"', 'class="bottle-img" src="garrafa.jpg"'

[IO.File]::WriteAllText("index.html", $html)
Write-Host "index.html updated successfully."
