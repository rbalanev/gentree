@echo off
REM Запуск Backend (FastAPI)
REM Открывает новое окно PowerShell и запускает uvicorn
powershell.exe -NoProfile -Command "Set-Location D:\_project_py\00003_heritage\backend; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; uvicorn main:app --reload --port 8000"
