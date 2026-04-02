$html = Get-Content -Path "index.html" -Raw
$pattern = 'data:image/[^;]+;base64,[^"]+'
$matches = [regex]::Matches($html, $pattern)
$i = 1
foreach ($m in $matches) {
    $b64 = $m.Value -replace 'data:image/[^;]+;base64,', ''
    try {
        $bytes = [Convert]::FromBase64String($b64)
        [IO.File]::WriteAllBytes("galeria_$i.jpg", $bytes)
        Write-Host "galeria_$i.jpg saved"
    } catch {
        Write-Host "Skipped invalid base64"
    }
    $html = $html.Replace($m.Value, "galeria_$i.jpg")
    $i++
}
[IO.File]::WriteAllText("index.html", $html)
Write-Host "Done"
