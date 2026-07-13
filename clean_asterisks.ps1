$path = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Replace ***bold italic*** with <strong><em>$1</em></strong>
$content = [regex]::Replace($content, '\*\*\*([^*]+)\*\*\*', '<strong><em>$1</em></strong>')

# Replace **bold** with <strong>$1</strong>
$content = [regex]::Replace($content, '\*\*([^*]+)\*\*', '<strong>$1</strong>')

# Save back
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
Write-Host "Cleaned double/triple asterisks from app.js successfully!"
