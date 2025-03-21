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

# Ensure scripts are executable
.PHONY: ensure-executable
ensure-executable:
	chmod +x ./run-migrations.sh
	chmod +x ./scripts/reset-database.sh
	chmod +x ./scripts/setup-fresh-database.sh

# Run migrations
.PHONY: migrate
migrate: ensure-executable
	./run-migrations.sh

# Reset the database (drop and recreate)
.PHONY: reset-db
reset-db: ensure-executable
	./scripts/reset-database.sh

# Setup a fresh database (reset, run migrations, and seed data)
.PHONY: setup-fresh-db
setup-fresh-db: ensure-executable
	./scripts/setup-fresh-database.sh

# Create a new migration file
.PHONY: create-migration
create-migration:
	@echo "Enter migration name:"; \
	read name; \
	node ./scripts/create-migration.js "$$name"

# Create a new seed file
.PHONY: create-seed
create-seed:
	@echo "Enter seed file name:"; \
	read name; \
	node ./scripts/create-seed.js "$$name"

# Help command
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make migrate               - Run database migrations"
	@echo "  make reset-db              - Reset database (drop and recreate)"
	@echo "  make setup-fresh-db        - Setup fresh database with migrations and seed data"
	@echo "  make create-migration      - Create a new migration file"
	@echo "  make create-seed           - Create a new seed file"
	@echo "  make help                  - Show this help message"
	@echo ""
	@echo "Environment variables (current values shown):"
	@echo "  DB_HOST=$(DB_HOST)"
	@echo "  DB_PORT=$(DB_PORT)"
	@echo "  DB_NAME=$(DB_NAME)"
	@echo "  DB_USER=$(DB_USER)"
	@echo "  DB_PASSWORD=$(DB_PASSWORD)"

# Default target
.DEFAULT_GOAL := help
