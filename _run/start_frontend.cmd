@echo off
REM Запуск Frontend (React + Vite)
REM Открывает новое окно PowerShell и запускает Vite dev server
powershell.exe -NoProfile -Command "Set-Location D:\_project_py\00003_heritage\frontend; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; npm run dev"
