import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import {
  randomGeo,
  randomColor,
  randomModel,
  randomType,
} from '../utils/index';

@Injectable()
export class CarSeedService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async onModuleInit() {
    const count = await this.carRepository.count();

    if (count > 0) {
      console.log('Data already seeded.');
      return;
    }

    for (let i = 0; i < 50000000; i++) {
      const geo = randomGeo();
      const car = new Car();
      car.type = randomType();
      car.model = randomModel();
      car.latitude = geo.latitude;
      car.longitude = geo.longitude;
      car.mileage = Math.floor(Math.random() * 300000);
      car.year = Math.floor(Math.random() * 31) + 1990;
      car.color = randomColor();
      await this.carRepository.save(car);
    }
  }
}
