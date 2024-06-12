import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const morningDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST_MORNING || 'morningDb',
  port: parseInt(process.env.DB_PORT_MORNING, 10) || 5432,
  username: process.env.DB_USER_MORNING || 'postgres',
  password: process.env.DB_PASS_MORNING || 'postgres',
  database: process.env.DB_NAME_MORNING || 'morningDb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const afternoonDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST_AFTERNOON || 'afternoonDb',
  port: parseInt(process.env.DB_PORT_AFTERNOON, 10) || 5432,
  username: process.env.DB_USER_AFTERNOON || 'postgres',
  password: process.env.DB_PASS_AFTERNOON || 'postgres',
  database: process.env.DB_NAME_AFTERNOON || 'afternoonDb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
