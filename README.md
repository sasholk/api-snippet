# Snippet Manager API

Snippet Manager API built with [NestJS](https://github.com/nestjs/nest) framework using TypeScript, PostgreSQL, TypeORM, and Redis. The project follows clean architecture principles and provides a robust environment configuration system with Docker support.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Environment Configuration

This project uses a robust environment configuration system that validates and provides type safety for all environment variables. The configuration is modular and follows NestJS best practices.

### Environment Variables

The following environment variables are used in this application:

#### Application
- `NODE_ENV` - Application environment ('development', 'production', 'test')
- `PORT` - Port the application runs on
- `API_PREFIX` - Prefix for all API endpoints

#### Database
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_NAME` - PostgreSQL database name
- `DB_SCHEMA` - PostgreSQL schema (default: 'public')

#### TypeORM
- `TYPEORM_LOGGING` - Enable/disable TypeORM query logging
- `TYPEORM_SYNCHRONIZE` - Enable/disable schema synchronization (WARNING: do not use in production)
- `TYPEORM_MIGRATIONS_RUN` - Enable/disable automatic migrations on startup

#### JWT
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRATION` - JWT token expiration time in seconds

#### Redis
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port

### Environment Files

The application looks for different environment files based on the `NODE_ENV` value:

- `.env.dev` - Used for development environment
- `.env` - Used for production environment

You can create these files based on the `.env.example` template.

## Database Migrations

This project uses TypeORM migrations for database schema management. Migrations ensure that your database schema changes are versioned, revertible, and can be applied consistently across different environments.

### Creating Migrations

To create a new migration after modifying entity files:

```bash
# Generate a new migration based on schema changes
pnpm run migration:generate --name=MigrationName

# Create an empty migration file
pnpm run migration:create --name=MigrationName
```

### Running Migrations

Migrations can be run in several ways:

```bash
# Run migrations manually
pnpm run migration:run

# Revert the last applied migration
pnpm run migration:revert
```

### Programmatic Migration Execution

The application includes a script to run migrations programmatically, which is especially useful for Docker environments:

```bash
# Run migrations programmatically
NODE_ENV=development ts-node src/scripts/run-migrations.ts
```

## Docker Setup

This project is fully dockerized for both development and production environments.

### Docker Compose

For local development with Docker, use:

```bash
# Start the application with PostgreSQL and Redis
docker compose up

# Start in detached mode
docker compose up -d

# Stop all containers
docker compose down
```

### Docker Migration Script

The project includes a `docker-migrations.sh` script that ensures migrations are run after the PostgreSQL container is ready:

```bash
# Inside Docker container
./docker-migrations.sh
```

This script:
1. Waits for PostgreSQL to be ready
2. Runs database migrations
3. Handles retries and error reporting

### Production Docker Deployment

For production deployment:

```bash
# Build the Docker image
docker build -t snippet-manager-api .

# Run the container
docker run -p 3000:3000 --env-file .env snippet-manager-api
```

## Deployment

When deploying to production, ensure you:

1. Set appropriate environment variables in your `.env` file
2. Disable `TYPEORM_SYNCHRONIZE` to prevent accidental schema changes
3. Run migrations manually or via the migration script
4. Use a process manager like PM2 or Docker orchestration tools for container management

For cloud deployment options, check out the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
