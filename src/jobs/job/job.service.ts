// src/jobs/job.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CarSeedService } from 'src/car/car-seed.service';

@Injectable()
export class JobService {
  constructor(
    @InjectQueue('car-queue') private carQueue: Queue,
    private readonly carSeedService: CarSeedService, 
  ) {}

  async addCarJob() {
    await this.carQueue.add({}, { repeat: { every: 60000 } }); 
  }

  async processCarJob() {
    this.carQueue.process(async () => {
      await this.carSeedService.seedCars(10000); 
    });
  }
}
