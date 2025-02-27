.PHONY: dev dev-app dev-server storybook build build-all build-app build-server test test-all test-app test-server test-common db-migrate db-reset clean 

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

# Database operations
db-migrate:
	docker compose run --rm -w /app/server server pnpm run db:migrate

db-reset:
	docker compose run --rm -w /app/server server pnpm run db:reset

db-seed:
	docker compose run --rm -w /app/server server pnpm run db:seed

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
	docker compose -f docker-compose.test.yml down -v

# Enter container shell
app-shell:
	docker compose run --rm app sh

server-shell:
	docker compose run --rm server sh

common-shell:
	docker compose run --rm -w /app/common app sh

# Logs
logs:
	docker compose logs -f

app-logs:
	docker compose logs -f app

server-logs:
	docker compose logs -f server

# Start the entire stack
up:
	docker compose up -d

# Stop the entire stack
down:
	docker compose down

# Rebuild containers
rebuild:
	docker compose build --no-cache