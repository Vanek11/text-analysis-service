# English Text Analysis Service

Веб-сервис для лингвистического анализа английского текста с POS-тегированием, dependency parsing и определением грамматических характеристик.

**Версия:** 1.0.0  
**В разработке:** 1.1.0 (см. [ROADMAP.md](ROADMAP.md) и [FEATURES_V1.1.0.md](FEATURES_V1.1.0.md))

## Архитектура

- **Frontend**: React + Vite
- **Backend API**: Node.js + Express
- **NLP Service**: Python + FastAPI + spaCy
- **Кэширование**: Redis
- **Контейнеризация**: Docker

## Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)
- Python 3.10+ (для локальной разработки)

### Запуск через Docker Compose

```bash
docker-compose up --build
```

Сервисы будут доступны:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- NLP Service: http://localhost:8000

### Локальная разработка

#### NLP Service

```bash
cd nlp-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Backend API

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Документация

### POST /api/v1/analyze

Анализ текста (синхронный).

**Request:**
```json
{
  "text": "The cat sat on the mat.",
  "options": {
    "include_morphology": true,
    "include_entities": false
  }
}
```

**Response:**
```json
{
  "tokens": [...],
  "sentences": [...],
  "dependency_tree": {...}
}
```

## Документация

- **[USER_GUIDE.md](USER_GUIDE.md)** — Подробное руководство пользователя с описанием всех функций сервиса
- **[QUICK_START.md](QUICK_START.md)** — Быстрый старт для разработчиков
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Руководство по развертыванию
- **[ROADMAP.md](ROADMAP.md)** — План развития и новые функции
- **[CHANGELOG.md](CHANGELOG.md)** — История изменений
- **[FEATURES_V1.1.0.md](FEATURES_V1.1.0.md)** — Новые функции версии 1.1.0

## Структура проекта

```
text-analysis-service/
├── frontend/          # React приложение
├── backend/           # Node.js API
├── nlp-service/       # Python NLP микросервис
└── docker-compose.yml
```

