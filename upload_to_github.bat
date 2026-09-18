@echo off
setlocal EnableDelayedExpansion

echo ========================================================
echo   HimAlert AI / VyomForge GitHub Push & Sync Script
echo ========================================================
echo.

:: Detect git executable
set "GIT_CMD=git"
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    ) else (
        echo [ERROR] Git was not found in PATH or at "C:\Program Files\Git\cmd\git.exe"
        echo Please install Git or add it to PATH.
        pause
        exit /b 1
    )
)

cd /d "%~dp0"
echo Working directory: %CD%
echo.

:: Display current remote
echo Current Remote origin:
"%GIT_CMD%" remote -v
echo.

echo --------------------------------------------------------
echo Choose an option:
echo   [1] Push updates to existing repo: https://github.com/DevlprArchit/HimAlert-AI
echo   [2] Change remote URL to a new repository and push
echo   [3] Just check git status
echo --------------------------------------------------------
set /p CHOICE="Select option (1, 2, or 3) [Default: 1]: "
if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="3" (
    echo.
    "%GIT_CMD%" status
    pause
    exit /b 0
)

if "%CHOICE%"=="2" (
    echo.
    set /p NEW_URL="Enter the new GitHub repository URL (e.g., https://github.com/USERNAME/REPO.git): "
    if not "!NEW_URL!"=="" (
        "%GIT_CMD%" remote set-url origin !NEW_URL!
        echo Remote origin updated to: !NEW_URL!
    )
)

echo.
set /p COMMIT_MSG="Enter commit message (press ENTER for default: 'Update project files'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update project files

echo.
echo [1/4] Staging files...
"%GIT_CMD%" add .

echo.
echo [2/4] Committing...
"%GIT_CMD%" commit -m "%COMMIT_MSG%"

echo.
echo [3/4] Pulling latest changes from remote (rebase)...
"%GIT_CMD%" pull origin main --rebase

echo.
echo [4/4] Pushing to GitHub (origin main)...
"%GIT_CMD%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] Upload to GitHub completed successfully!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [NOTICE] If push failed due to authentication,
    echo   please sign in via GitHub Credential Manager or Personal
    echo   Access Token (PAT) when prompted in your terminal.
    echo ========================================================
)

echo.
pause
