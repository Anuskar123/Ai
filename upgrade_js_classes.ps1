$files = @('app.js', 'test2_logic.js')
foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # Replace hardcoded dark inline styles with CSS variables or clean classes
    $c = $c.Replace('style="background:#d1fae5;color:#065f46;border:1px solid #34d399;"', 'class="status-badge status-active"')
    $c = $c.Replace('style="background:#fee2e2;color:#991b1b;border:1px solid #f87171;"', 'class="status-badge status-alert"')
    $c = $c.Replace('style="background:rgba(255,255,255,0.08);color:#cbd5e1;"', 'class="status-badge status-neutral"')
    $c = $c.Replace('style="border-left: 4px solid #818cf8;"', 'style="border-left: 4px solid var(--primary);"')
    $c = $c.Replace('style="background:#312e81;color:#c7d2fe;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:700;"', 'class="badge badge-primary"')
    $c = $c.Replace('style="margin-left:8px;background:rgba(129,140,248,0.15);color:#818cf8;border:1px solid #818cf8;"', 'class="badge badge-purple"')
    $c = $c.Replace('style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:1.1rem;margin:1rem 0;overflow-x:auto;"', 'class="code-box"')
    $c = $c.Replace('style="font-family:\x27JetBrains Mono\x27,monospace;color:#38bdf8;font-size:0.88rem;line-height:1.5;"', 'class="code-text"')
    $c = $c.Replace('style="font-family:''JetBrains Mono'',monospace;color:#38bdf8;font-size:0.88rem;line-height:1.5;"', 'class="code-text"')
    $c = $c.Replace('style="width:100%;margin:1.2rem 0;border-collapse:collapse;"', 'class="data-table"')
    $c = $c.Replace('style="background:#1e293b;border-bottom:2px solid #475569;"', 'class="table-header"')
    $c = $c.Replace('style="padding:10px;text-align:left;color:#f8fafc;"', 'class="table-cell-th"')
    $c = $c.Replace('style="border-bottom:1px solid #334155;"', 'class="table-row"')
    $c = $c.Replace('style="padding:10px;font-weight:600;color:#93c5fd;"', 'class="table-cell-colA"')
    $c = $c.Replace('style="padding:10px;color:#cbd5e1;line-height:1.5;"', 'class="table-cell-colB"')
    $c = $c.Replace('style="border-left:4px solid #6366f1;"', 'style="border-left:4px solid var(--primary);"')
    $c = $c.Replace('style="color:#a5b4fc;"', 'style="color:var(--primary);font-weight:700;"')
    $c = $c.Replace('style="color:#e2e8f0;line-height:1.6;"', 'style="color:var(--text-primary);line-height:1.6;"')

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $c, $utf8NoBom)
    Write-Host "Upgraded inline styles in $f."
}
