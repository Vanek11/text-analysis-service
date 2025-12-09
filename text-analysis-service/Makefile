.PHONY: build up down logs test clean

# Build all services
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Run tests
test:
	cd nlp-service && pytest
	cd backend && npm test

# Clean up
clean:
	docker-compose down -v
	docker system prune -f

# Production build
build-prod:
	docker-compose -f docker-compose.prod.yml build

# Production up
up-prod:
	docker-compose -f docker-compose.prod.yml up -d

# Production down
down-prod:
	docker-compose -f docker-compose.prod.yml down

