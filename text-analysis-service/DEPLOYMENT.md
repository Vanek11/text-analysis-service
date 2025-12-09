# Deployment Guide

## Docker Compose (Development)

```bash
docker-compose up --build
```

## Docker Compose (Production)

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes

### Prerequisites

- Kubernetes cluster
- kubectl configured
- Docker images built and pushed to registry

### Build and Push Images

```bash
# Build images
docker build -t your-registry/text-analysis-nlp-service:latest ./nlp-service
docker build -t your-registry/text-analysis-backend:latest ./backend
docker build -t your-registry/text-analysis-frontend:latest ./frontend

# Push to registry
docker push your-registry/text-analysis-nlp-service:latest
docker push your-registry/text-analysis-backend:latest
docker push your-registry/text-analysis-frontend:latest
```

### Deploy

```bash
# Deploy Redis
kubectl apply -f kubernetes/redis.yaml

# Deploy services
kubectl apply -f kubernetes/deployment.yaml
```

## Environment Variables

### Backend

- `PORT`: Server port (default: 3001)
- `NLP_SERVICE_URL`: URL of NLP service
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

### NLP Service

- `PORT`: Server port (default: 8000)
- `LOG_LEVEL`: Logging level (INFO/DEBUG/ERROR)
- `SPACY_MODEL`: spaCy model name (default: en_core_web_sm)

### Frontend

- `VITE_API_URL`: Backend API URL

## Health Checks

All services expose health check endpoints:

- Backend: `GET /api/health`
- NLP Service: `GET /health`

## Scaling

### Docker Compose

Edit `docker-compose.prod.yml` and change `replicas` in deploy section.

### Kubernetes

```bash
kubectl scale deployment nlp-service --replicas=3
kubectl scale deployment backend --replicas=3
```

## Monitoring

### Logs

```bash
# Docker Compose
docker-compose logs -f [service-name]

# Kubernetes
kubectl logs -f deployment/[service-name]
```

### Metrics

Services expose metrics through health check endpoints. Consider integrating with:
- Prometheus
- Grafana
- ELK Stack

## Security Considerations

1. Use secrets for sensitive environment variables
2. Enable HTTPS/TLS in production
3. Configure proper CORS origins
4. Set up rate limiting
5. Use network policies in Kubernetes
6. Regularly update dependencies

