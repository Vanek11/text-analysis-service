# PowerShell скрипт для запуска проекта на Windows

Write-Host "Starting English Text Analysis Service..." -ForegroundColor Green

# Проверка наличия Docker
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "Docker не установлен. Пожалуйста, установите Docker Desktop." -ForegroundColor Red
    exit 1
}

# Проверка наличия docker-compose
$composeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $composeInstalled) {
    Write-Host "docker-compose не найден. Используется 'docker compose'..." -ForegroundColor Yellow
    docker compose up --build
} else {
    docker-compose up --build
}

Write-Host "`nСервисы запущены!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "NLP Service: http://localhost:8000" -ForegroundColor Cyan

