#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until pg_isready -h postgres -U postgres -d snippets; do
  sleep 1
done
echo "PostgreSQL is ready"

# Run migrations
echo "Running migrations..."
pnpm run migrations:run:programmatic
