import { RedisModuleOptions } from '@nestjs/redis';

export const redisConfig: RedisModuleOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  db: parseInt(process.env.REDIS_DB, 10),
};
