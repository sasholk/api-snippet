import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppModule } from '../app.module';

/**
 * Script to run TypeORM migrations programmatically
 * Can be used in Docker containers or CI/CD pipelines
 *
 * Usage:
 * - Direct: NODE_ENV=development ts-node src/scripts/run-migrations.ts
 * - Via npm script: npm run migrations:run
 */
async function runMigrations(): Promise<void> {
  const logger = new Logger('Migrations');

  try {
    // Create a standalone application context
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Get the DataSource from the TypeORM module
    const dataSource = app.get(DataSource);

    // Ensure the connection is initialized
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    // Run pending migrations
    logger.log('Running migrations...');
    const migrations = await dataSource.runMigrations({ transaction: 'each' });

    if (migrations.length > 0) {
      logger.log(`Successfully ran ${migrations.length} migrations:`);
      migrations.forEach((migration) => logger.log(`- ${migration.name}`));
    } else {
      logger.log('No pending migrations to run');
    }

    await app.close();
    process.exit(0);
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    logger.error(`Error running migrations: ${errorMessage}`, errorStack);
    process.exit(1);
  }
}

// Execute the function with proper promise handling
void runMigrations().catch((error) => {
  console.error('Unhandled error in runMigrations:', error);
  process.exit(1);
});
