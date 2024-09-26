import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CarModule } from 'src/car/car.module';
import { JobService } from './job/job.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'car-queue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CarModule,
  ],
  providers: [JobService],
})
export class JobsModule {}
