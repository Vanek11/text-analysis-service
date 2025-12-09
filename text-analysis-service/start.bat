@echo off
echo Starting English Text Analysis Service...
echo.

REM Проверка наличия Docker
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker не установлен. Пожалуйста, установите Docker Desktop.
    pause
    exit /b 1
)

REM Запуск через docker-compose или docker compose
docker-compose --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    docker-compose up --build
) else (
    docker compose up --build
)

echo.
echo Сервисы запущены!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3001
echo NLP Service: http://localhost:8000
pause

