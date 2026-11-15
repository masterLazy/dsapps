@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required but was not found on PATH.
  goto :failed
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is required but was not found on PATH.
  goto :failed
)

where git >nul 2>nul
if errorlevel 1 (
  echo Git is required but was not found on PATH.
  goto :failed
)

if not exist "node_modules\.bin\vite.cmd" (
  echo Installing dependencies...
  call npm ci
  if errorlevel 1 goto :failed
)

echo Building site into docs\...
call npm run build
if errorlevel 1 goto :failed

echo Staging changes...
git add -A
if errorlevel 1 goto :failed

git diff --cached --quiet
if %errorlevel% equ 0 goto :push
if %errorlevel% geq 2 goto :failed

git commit -m "build: publish site"
if errorlevel 1 goto :failed

:push
echo Pushing current branch to origin...
git push origin HEAD
if errorlevel 1 goto :failed

echo Build, commit, and push completed successfully.
goto :end

:failed
echo Build or deployment failed. Review the output above.
exit /b 1

:end
pause
exit /b 0