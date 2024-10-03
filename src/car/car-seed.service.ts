import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { LoggerService } from 'src/common/logging/logger/logger.service';
import { randomGeo, randomColor, randomModel, randomType } from '../utils';

@Injectable()
export class CarSeedService implements OnModuleInit {
  private readonly BATCH_SIZE = 10000;
  private readonly PROGRESS_INTERVAL = 100000; // Log progress every 100,000 cars
  private readonly TOTAL_CARS_TO_SEED = 5000000;

  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly loggerService: LoggerService,
  ) {}

  async seedCars(totalCount: number) {
    this.loggerService.log(`Seeding ${totalCount} cars...`);

    let carCount = await this.carRepository.count();
    while (carCount < totalCount) {
      const remaining = totalCount - carCount;
      const batchCount = Math.min(this.BATCH_SIZE, remaining);
      const cars = await this.generateCarBatch(batchCount);

      await this.insertBatch(cars);
      carCount = await this.carRepository.count();

      if (carCount % this.PROGRESS_INTERVAL === 0) {
        this.loggerService.log(`${carCount}/${totalCount} cars seeded.`);
      }
    }

    this.loggerService.log(`Seeding completed: ${totalCount} cars.`);
  }

  private async generateCarBatch(count: number): Promise<Car[]> {
    const cars: Car[] = [];
    for (let i = 0; i < count; i++) {
      const geo = randomGeo();
      const car = new Car();
      car.type = randomType();
      car.model = randomModel();
      car.latitude = geo.latitude;
      car.longitude = geo.longitude;
      car.mileage = Math.floor(Math.random() * 300000);
      car.year = Math.floor(Math.random() * 31) + 1990;
      car.color = randomColor();
      cars.push(car);
    }
    return cars;
  }

  private async insertBatch(cars: Car[]) {
    if (!cars.length) return;

    try {
      await this.carRepository.manager.transaction(async (entityManager) => {
        await entityManager.insert(Car, cars);
      });
      this.loggerService.log(
        `Inserted batch of ${cars.length} cars successfully.`,
      );
    } catch (error) {
      this.loggerService.error('Error inserting cars batch', error);
    }
  }

  async onModuleInit() {
    const carCount = await this.carRepository.count();

    if (carCount === 0) {
      this.loggerService.log('No data found, seeding 5 million cars on init.');
      await this.seedCars(this.TOTAL_CARS_TO_SEED);
    } else {
      this.loggerService.log(
        `Data already seeded. Current car count: ${carCount}`,
      );
    }
  }
}
