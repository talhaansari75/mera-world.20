@echo off
REM ============================================
REM Mera World - Quick Backup Script
REM Run this before making big changes!
REM ============================================

cd /d D:\mera-world.20

echo.
echo === Creating backup ===
echo.

REM Get current date/time
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%-%dt:~10,2%"

echo [1/4] Staging all changes...
git add .

echo [2/4] Committing with timestamp...
git commit -m "Auto-backup %timestamp%" 2>nul
if errorlevel 1 (
    echo       No changes to commit.
)

echo [3/4] Pushing to GitHub...
git push origin main

echo [4/4] Creating local zip backup...
if not exist "D:\backups" mkdir "D:\backups"
git archive --format=zip --output="D:\backups\mera-world_%timestamp%.zip" HEAD

echo.
echo === Backup complete! ===
echo Zip saved to: D:\backups\mera-world_%timestamp%.zip
echo.

pause