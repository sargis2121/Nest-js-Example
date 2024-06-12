import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JobModule } from './job/job.module';
import { JobService } from './job/job.service';
import { JobSnapshotModule } from './job-snapshot/job-snapshot.module';
import { morningDbOptions, afternoonDbOptions } from './config/typeorm.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';

const currentHour = new Date().getHours();
const dbOptions = currentHour < 12 ? morningDbOptions : afternoonDbOptions;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CacheModule.register(),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`),
    TypeOrmModule.forRoot(dbOptions),
    EventEmitterModule.forRoot(),
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          config: {
            url: `redis://${configService.get<string>(
              'REDIS_HOST',
            )}:${+configService.get<string>('REDIS_PORT')}`,
            host: configService.get<string>('REDIS_HOST'),
            port: +configService.get<string>('REDIS_PORT'),
            retryDelay: 3000,
            retryAttempts: 100,
          },
        }),
        inject: [ConfigService],
      },
      true,
    ),
    JobModule,
    JobSnapshotModule,
  ],
  providers: [
    JobService,
    { provide: CACHE_MANAGER, useExisting: Cache },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
