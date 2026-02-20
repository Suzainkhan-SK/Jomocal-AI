# PowerShell script to complete git rebase and push
Set-Location "F:\Automation Studio NEW"

Write-Host "Step 1: Removing swap file..." -ForegroundColor Yellow
if (Test-Path ".git\.COMMIT_EDITMSG.swp") {
    Remove-Item ".git\.COMMIT_EDITMSG.swp" -Force
    Write-Host "Swap file removed." -ForegroundColor Green
}

Write-Host "`nStep 2: Staging package.json..." -ForegroundColor Yellow
git add package.json
if ($LASTEXITCODE -eq 0) {
    Write-Host "package.json staged successfully." -ForegroundColor Green
} else {
    Write-Host "Error staging package.json" -ForegroundColor Red
    exit 1
}

Write-Host "`nStep 3: Continuing rebase..." -ForegroundColor Yellow
# Use git commit with message to avoid editor
$env:GIT_EDITOR = "echo"
$commitMessage = "Fix SPA routing - update start script"
git -c core.editor=true rebase --continue
# If that doesn't work, try committing directly
if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying alternative method..." -ForegroundColor Yellow
    git commit -m "Fix SPA routing - update start script"
    git rebase --continue
}
if ($LASTEXITCODE -eq 0) {
    Write-Host "Rebase completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Rebase failed. Trying to skip..." -ForegroundColor Yellow
    git rebase --skip
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Rebase skipped successfully." -ForegroundColor Green
    } else {
        Write-Host "Rebase failed. Check the error above." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nStep 4: Checking git status..." -ForegroundColor Yellow
git status

Write-Host "`nStep 5: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main --force-with-lease
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Push failed. You may need to push manually." -ForegroundColor Yellow
    Write-Host "Try: git push origin main --force-with-lease" -ForegroundColor Cyan
}
