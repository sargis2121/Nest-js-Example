import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { LoggerService } from './common/logging/logger/logger.service';
import { LoggerMiddleware } from './common/logging/logger/logger.middleware';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [CarModule, DatabaseModule, JobsModule],
  controllers: [HealthController],
  providers: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
