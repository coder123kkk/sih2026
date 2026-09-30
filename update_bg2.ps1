Get-ChildItem -Path "src\app" -Recurse -Filter "*.js" | ForEach-Object {
    $content = Get-Content $_.FullName
    
    # Replace #F8FAFC, #F1F5F9, #FEF3C7, #EEF2FF, #E0E7FF everywhere
    $content = $content -replace "'#F8FAFC'", "'var(--color-bg-tertiary)'"
    $content = $content -replace "'#F1F5F9'", "'var(--color-bg-tertiary)'"
    $content = $content -replace "'#EEF2FF'", "'var(--color-brand-tint)'"
    $content = $content -replace "'#FEF3C7'", "'var(--color-surface-chip)'"
    $content = $content -replace "'#E0E7FF'", "'var(--color-surface-chip)'"
    $content = $content -replace "'#E2E8F0'", "'var(--color-border)'"
    $content = $content -replace "'#CBD5E1'", "'var(--color-border-hover)'"
    
    # Replace #FFFFFF only if it's used as background
    $content = $content -replace "background\s*[:=]\s*(?:.*?)?'#FFFFFF'", "background: 'var(--color-bg-secondary)'"
    
    # Replace inline styles where background is set conditionally to #FFFFFF
    $content = $content -replace "\? '#FFFFFF' :", "? 'var(--color-bg-secondary)' :"
    $content = $content -replace ": '#FFFFFF'", ": 'var(--color-bg-secondary)'"
    $content = $content -replace "= '#FFFFFF'", "= 'var(--color-bg-secondary)'"

    $content | Set-Content $_.FullName
}

git diff
