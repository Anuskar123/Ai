# Add math render hook right after innerHTML updates and option checks
$files = @('app.js', 'test2_logic.js')
foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # Hook after container.innerHTML = html;
    $c = [regex]::Replace($c, '(container\.innerHTML\s*=\s*html;)(?!\s*setTimeout\(\(\)\s*=>\s*\{\s*if\s*\(\s*window\.renderAllMath)', '$1 setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);')

    # Hook inside checkTest1Option
    $c = [regex]::Replace($c, '(function checkTest1Option\([^)]*\)\s*\{)', '$1 setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);')

    # Hook inside checkTest2Option
    $c = [regex]::Replace($c, '(function checkTest2Option\([^)]*\)\s*\{)', '$1 setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);')

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $c, $utf8NoBom)
    Write-Host "Hooked renderAllMath across $f."
}
