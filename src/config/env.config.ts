import { join } from 'path';

import { registerAs } from '@nestjs/config';

/**
 * Environment validation schema using plain object
 * More TypeScript-friendly than Joi schema
 */
export const envValidationSchema = {
  // Application
  NODE_ENV: {
    validate: (value: string): boolean =>
      ['development', 'production', 'test'].includes(value),
    default: 'development',
  },
  PORT: {
    validate: (value: string): boolean => !isNaN(Number(value)),
    default: '3000',
  },
  API_PREFIX: {
    default: 'api',
  },

  // Database
  DB_HOST: {
    required: true,
  },
  DB_PORT: {
    validate: (value: string): boolean => !isNaN(Number(value)),
    default: '5432',
  },
  DB_USERNAME: {
    required: true,
  },
  DB_PASSWORD: {
    required: true,
  },
  DB_NAME: {
    required: true,
  },
  DB_SCHEMA: {
    default: 'public',
  },

  // TypeORM
  TYPEORM_LOGGING: {
    validate: (value: string): boolean => ['true', 'false'].includes(value),
    default: 'true',
  },
  TYPEORM_SYNCHRONIZE: {
    validate: (value: string): boolean => ['true', 'false'].includes(value),
    default: 'false',
  },
  TYPEORM_MIGRATIONS_RUN: {
    validate: (value: string): boolean => ['true', 'false'].includes(value),
    default: 'true',
  },

  // JWT
  JWT_SECRET: {
    required: true,
  },
  JWT_EXPIRATION: {
    validate: (value: string): boolean => !isNaN(Number(value)),
    default: '3600',
  },

  // Redis
  REDIS_HOST: {
    required: true,
  },
  REDIS_PORT: {
    validate: (value: string): boolean => !isNaN(Number(value)),
    default: '6379',
  },
};

/**
 * Validate environment variables based on schema
 */
export function validateEnvVars(): void {
  const errors: string[] = [];

  for (const [key, config] of Object.entries(envValidationSchema)) {
    const value = process.env[key];

    // Check required fields
    if ('required' in config && config.required && !value) {
      errors.push(`Environment variable ${key} is required`);
      continue;
    }

    // Run validation functions
    if (value && 'validate' in config && !config.validate(value)) {
      errors.push(`Environment variable ${key} failed validation`);
    }

    // Set defaults if not provided
    if (!value && 'default' in config) {
      process.env[key] = config.default;
    }
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    throw new Error('Invalid environment configuration');
  }
}

/**
 * Interface definitions for configuration sections
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
  logging: boolean;
  synchronize: boolean;
  migrationsRun: boolean;
  entities: string[];
  migrations: string[];
}

export interface AppConfig {
  env: string;
  port: number;
  apiPrefix: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export interface RedisConfig {
  host: string;
  port: number;
}

/**
 * Parse boolean from environment variable
 */
function parseBoolean(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Database configuration
 */
export const databaseConfig = registerAs('database', (): DatabaseConfig => {
  const rootDir = join(__dirname, '..');

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'snippets',
    schema: process.env.DB_SCHEMA || 'public',
    logging: parseBoolean(process.env.TYPEORM_LOGGING, true),
    synchronize: parseBoolean(process.env.TYPEORM_SYNCHRONIZE, false),
    migrationsRun: parseBoolean(process.env.TYPEORM_MIGRATIONS_RUN, true),
    entities: [join(rootDir, '**', '*.entity.{ts,js}')],
    migrations: [join(rootDir, 'migrations', '*.{ts,js}')],
  };
});

/**
 * Application configuration
 */
export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
  }),
);

/**
 * JWT configuration
 */
export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
  }),
);

/**
 * Redis configuration
 */
export const redisConfig = registerAs(
  'redis',
  (): RedisConfig => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  }),
);
