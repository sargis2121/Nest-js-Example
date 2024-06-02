import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JobModule } from './job/job.module';
import { redisConfig } from './config/redis.config';
import { JobSnapshotModule } from './job-snapshot/job-snapshot.module';
import { morningDbOptions, afternoonDbOptions } from './config/typeorm.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RedisModule } from '@nestjs-modules/ioredis';

const currentHour = new Date().getHours();
const dbOptions = currentHour < 12 ? morningDbOptions : afternoonDbOptions;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TypeOrmModule.forRoot(dbOptions),
    EventEmitterModule.forRoot(),
    RedisModule.forRoot(redisConfig),
    JobModule,
    JobSnapshotModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
