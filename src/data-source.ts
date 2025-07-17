import { join } from 'path';
import * as fs from 'fs';

import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';

// Type-safe dotenv config loading
try {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    console.warn(`Environment file ${envFile} not found, using default values`);
  }
} catch (err) {
  console.error('Error loading environment variables:', err);
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'snippets',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
