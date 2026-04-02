$path = "index.html"
$str = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$encUTF8 = [System.Text.Encoding]::UTF8

try {
    # Undo step 2
    $bytes2 = $enc1252.GetBytes($str)
    $unmangled1 = $encUTF8.GetString($bytes2)

    # Undo step 1
    $bytes1 = $enc1252.GetBytes($unmangled1)
    $cleanStr = $encUTF8.GetString($bytes1)

    [IO.File]::WriteAllText($path, $cleanStr, $encUTF8)
    Write-Host "Encoding fixed!"
} catch {
    Write-Host "Error fixing encoding: $_"
}
