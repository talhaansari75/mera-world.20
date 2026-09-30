@echo off
REM ============================================
REM Mera World - Restore from last tag
REM Use this when something breaks!
REM ============================================

cd /d D:\mera-world.20

echo.
echo === Restoring from tag v0.1-working ===
echo.

echo [1/3] Fetching latest from GitHub...
git fetch --all --tags

echo [2/3] Resetting to tag v0.1-working...
git reset --hard v0.1-working

echo [3/3] Cleaning untracked files...
git clean -fd Assets/Scripts

echo.
echo === Restore complete! ===
echo Open Unity and let it recompile.
echo.

pause