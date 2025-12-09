# Quick Start Guide

## Prerequisites

- Docker and Docker Compose installed
- For local development: Node.js 18+ and Python 3.10+

## Quick Start with Docker

1. Clone the repository and navigate to the project directory:
```bash
cd text-analysis-service
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- NLP Service: http://localhost:8000

## Local Development

### NLP Service (Python)

```bash
cd nlp-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000
```

### Backend API (Node.js)

```bash
cd backend
npm install
npm run dev
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Python Tests

```bash
cd nlp-service
pytest
```

### Node.js Tests

```bash
cd backend
npm test
```

## API Usage

### Analyze Text (Synchronous)

```bash
curl -X POST http://localhost:3001/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The cat sat on the mat.",
    "options": {
      "include_morphology": true
    }
  }'
```

### Health Check

```bash
curl http://localhost:3001/api/health
```

## Troubleshooting

### NLP Service fails to start

Make sure spaCy model is installed:
```bash
python -m spacy download en_core_web_sm
```

### Redis connection errors

Ensure Redis is running:
```bash
docker-compose up redis
```

### Port conflicts

Edit `docker-compose.yml` to change port mappings.

