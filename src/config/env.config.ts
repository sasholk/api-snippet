import { join } from 'path';

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

/**
 * Environment validation schema using plain object
 * More TypeScript-friendly than Joi schema
 */
export const envValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SCHEMA: Joi.string().default('public'),

  // TypeORM
  TYPEORM_LOGGING: Joi.boolean().truthy('true').falsy('false').default(true),
  TYPEORM_SYNCHRONIZE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),
  TYPEORM_MIGRATIONS_RUN: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(true),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.number().default(3600),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
});

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
