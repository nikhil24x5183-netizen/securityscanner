@echo off
title Vibesheid GitHub Automated Uploader
cls
echo =================================================================
echo        VIBESHEID AI CODE SCANNER - ONE-CLICK GITHUB UPLOADER
echo =================================================================
echo.
set /p REPO_URL="Paste your GitHub Repository URL (e.g. https://github.com/username/vibesheid.git): "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] No GitHub repository URL provided. Exiting.
    pause
    exit /b
)

echo.
echo [1/4] Initializing Git repository...
git init

echo [2/4] Adding project files...
git add .

echo [3/4] Creating initial commit...
git commit -m "Initial release: Vibesheid AI Code Vulnerability & Error Scanner"

echo [4/4] Pushing to GitHub...
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main --force

echo.
echo =================================================================
echo   SUCCESS! Vibesheid source code is now live on GitHub!
echo =================================================================
pause
