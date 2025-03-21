# Makefile for database operations

# Default values for database connection
DB_HOST ?= localhost
DB_PORT ?= 5432
DB_NAME ?= prettygood
DB_USER ?= postgres
DB_PASSWORD ?= postgres

# Export variables for script access
export DB_HOST
export DB_PORT
export DB_NAME
export DB_USER
export DB_PASSWORD

.PHONY: setup-all local-setup docker-setup test-all

# Full setup from scratch
setup-all: docker-setup

# Setup for local development
local-setup:
	./scripts/setup-fresh-database.sh
	./scripts/generate-types.sh

# Setup for Docker development
docker-setup:
	docker-compose down -v || true
	docker-compose build --no-cache
	docker-compose up -d
	./scripts/setup-fresh-database-docker.sh
	./scripts/generate-types.sh

# Run all tests
test-all:
	./scripts/run-tests.sh

# Run all tests in Docker
docker-test-all:
	./scripts/run-tests-docker.sh

# Help command
help:
	@echo "Available commands:"
	@echo "  make setup-all            - Complete setup (currently uses Docker)"
	@echo "  make local-setup          - Setup database locally"
	@echo "  make docker-setup         - Setup database in Docker"
	@echo "  make test-all             - Run all tests locally"
	@echo "  make docker-test-all      - Run all tests in Docker"
	@echo "  make help                 - Show this help message"

# Default target
.DEFAULT_GOAL := help
