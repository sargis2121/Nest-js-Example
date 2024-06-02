import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const morningDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.MORNING_DB_HOST,
  port: parseInt(process.env.MORNING_DB_PORT, 10) || 5432,
  username: process.env.MORNING_DB_USERNAME,
  password: process.env.MORNING_DB_PASSWORD,
  database: process.env.MORNING_DB_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
};

export const afternoonDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.AFTERNOON_DB_HOST,
  port: parseInt(process.env.AFTERNOON_DB_PORT, 10) || 5432,
  username: process.env.AFTERNOON_DB_USERNAME,
  password: process.env.AFTERNOON_DB_PASSWORD,
  database: process.env.AFTERNOON_DB_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
};
