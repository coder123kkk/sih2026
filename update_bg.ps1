$cssPath = "src\app\globals.css"
(Get-Content $cssPath) -replace 'background:\s*#FFFFFF;?', 'background: var(--color-bg-secondary);' -replace 'background:\s*#F8FAFC;?', 'background: var(--color-bg-tertiary);' | Set-Content $cssPath

Get-ChildItem -Path "src\app" -Recurse -Filter "*.js" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace "background:\s*'#FFFFFF'", "background: 'var(--color-bg-secondary)'"
    $content = $content -replace "background:\s*'#F8FAFC'", "background: 'var(--color-bg-tertiary)'"
    $content = $content -replace "background:\s*'#EEF2FF'", "background: 'var(--color-brand-tint)'"
    $content = $content -replace "background:\s*'#FEF3C7'", "background: 'var(--color-surface-chip)'"
    $content = $content -replace "background:\s*'#F1F5F9'", "background: 'var(--color-bg-tertiary)'"
    $content | Set-Content $_.FullName
}

git diff
