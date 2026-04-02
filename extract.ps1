$html = Get-Content -Path "index.html" -Raw

# logo
if ($html -match 'src="data:image/[^;]+;base64,([^"]+)"\s+alt="Logo Kiaçaí"') {
    $bytes = [Convert]::FromBase64String($matches[1])
    [IO.File]::WriteAllBytes("logo.jpg", $bytes)
    Write-Host "logo.jpg saved"
} else {
    Write-Host "Logo pattern not found"
}

# bottle
if ($html -match 'class="bottle-img"\s+src="data:image/[^;]+;base64,([^"]+)"') {
    $bytes = [Convert]::FromBase64String($matches[1])
    [IO.File]::WriteAllBytes("garrafa.jpg", $bytes)
    Write-Host "garrafa.jpg saved"
} else {
    Write-Host "Bottle pattern not found"
}
