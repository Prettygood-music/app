.PHONY: dev dev-app dev-server storybook build build-all build-app build-server test test-all test-app test-server test-common db-migrate db-reset db-fresh db-test db-docker-up db-docker-down db-generate-types clean 

# Development
dev:
	docker compose up app server

dev-app:
	docker compose up app

dev-server:
	docker compose up server

storybook:
	docker compose up storybook

# Build for production
build-all:
	docker compose run --rm -w /app app pnpm run build

build-app:
	docker compose run --rm -w /app app pnpm run build:app

build-server:
	docker compose run --rm -w /app app pnpm run build:server

build-common:
	docker compose run --rm -w /app app pnpm run build:common

# Testing
test-all:
	docker compose run --rm -w /app app pnpm run test

test-app:
	docker compose run --rm -w /app app pnpm run test:app

test-app-unit:
	docker compose run --rm -w /app/app app pnpm run test:unit

test-app-e2e:
	docker compose run --rm -w /app/app app pnpm run test:e2e

test-app-storybook:
	docker compose run --rm -w /app/app app pnpm run test:storybook

test-server:
	docker compose run --rm -w /app app pnpm run test:server

test-common:
	docker compose run --rm -w /app app pnpm run test:common

# Database testing
db-test:
	docker compose run --rm -w /app/database database pnpm run test:db:dev

db-test-structure:
	docker compose run --rm -w /app/database database pnpm run test:db:structure

db-test-functions:
	docker compose run --rm -w /app/database database pnpm run test:db:functions

db-test-security:
	docker compose run --rm -w /app/database database pnpm run test:db:security

db-test-api:
	docker compose run --rm -w /app/database database pnpm run test:db:api

db-test-integrity:
	docker compose run --rm -w /app/database database pnpm run test:db:integrity

db-test-verbose:
	docker compose run --rm -w /app/database database pnpm run test:db:verbose

# Database operations
db-migrate:
	docker compose run --rm -w /app/database database pnpm run migrate:dev

db-reset:
	docker compose run --rm -w /app/database database pnpm run reset-db:dev

db-fresh:
	docker compose run --rm -w /app/database database pnpm run setup-fresh-db:dev

db-create-migration:
	docker compose run --rm -w /app/database database pnpm run create-migration

db-create-seed:
	docker compose run --rm -w /app/database database pnpm run create-seed

# Database Docker commands
db-docker-build:
	cd database && docker compose build

db-docker-up:
	cd database && docker compose up -d

db-docker-down:
	cd database && docker compose down

db-docker-logs:
	cd database && docker compose logs -f

db-docker-test:
	cd database && npm run docker:test

db-docker-test-structure:
	cd database && npm run docker:test:structure

db-docker-test-functions:
	cd database && npm run docker:test:functions

db-docker-test-security:
	cd database && npm run docker:test:security

db-docker-test-api:
	cd database && npm run docker:test:api

db-docker-test-integrity:
	cd database && npm run docker:test:integrity

db-docker-migrate:
	cd database && npm run docker:migrate

db-docker-reset:
	cd database && npm run docker:reset-db

db-docker-fresh:
	cd database && npm run docker:setup-fresh-db

db-docker-shell:
	cd database && npm run docker:shell

# Type generation
db-generate-types:
	docker compose run --rm -w /app/database database pnpm run generate-types

db-generate-types-advanced:
	docker compose run --rm -w /app/database database pnpm run generate-types:advanced

db-docker-generate-types:
	cd database && npm run generate-types:docker

db-docker-generate-types-advanced:
	cd database && npm run generate-types:advanced:docker

db-setup-and-generate:
	docker compose run --rm -w /app/database database pnpm run setup-and-generate

db-docker-setup-and-generate:
	cd database && npm run docker:setup-and-generate

# Utility
install-all:
	docker compose run --rm -w /app app pnpm install

lint-all:
	docker compose run --rm -w /app app pnpm run lint

format-all:
	docker compose run --rm -w /app app pnpm run format

# Clean up
clean:
	docker compose down -v
	docker compose -f docker compose.test.yml down -v
	cd database && docker compose down -v

# Enter container shell
app-shell:
	docker compose run --rm app sh

server-shell:
	docker compose run --rm server sh

common-shell:
	docker compose run --rm -w /app/common app sh

database-shell:
	docker compose run --rm -w /app/database database sh

# Logs
logs:
	docker compose logs -f

app-logs:
	docker compose logs -f app

server-logs:
	docker compose logs -f server

database-logs:
	docker compose logs -f database

# Start the entire stack
up:
	docker compose up -d

# Stop the entire stack
down:
	docker compose down

# Rebuild containers
rebuild:
	docker compose build --no-cache

# Run a complete test setup
test-setup: db-fresh clean rebuild install-all test-all db-test
	@echo "Test setup completed successfully"

# Run a complete Docker database test setup
db-docker-setup: db-docker-down db-docker-build db-docker-up db-docker-fresh db-docker-test
	@echo "Docker database setup completed successfully"

# Run a complete setup with type generation
setup-with-types: db-fresh db-generate-types-advanced test-all
	@echo "Setup with type generation completed successfully"

# Run a complete Docker setup with type generation
db-docker-setup-with-types: db-docker-down db-docker-build db-docker-up db-docker-fresh db-docker-generate-types-advanced db-docker-test
	@echo "Docker setup with type generation completed successfully"
