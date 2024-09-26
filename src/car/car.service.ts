import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { LoggerService } from 'src/common/logging/logger/logger.service';

interface SearchParams {
  type?: string;
  model?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  mileage?: number;
  year?: number;
  color?: string;
}

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly loggerService: LoggerService,
  ) {}

  async searchCars(params: SearchParams, traceId: string): Promise<Car[]> {
    this.loggerService.log(
      `Search initiated with params: ${JSON.stringify(params)} | TraceID: ${traceId}`,
    );

    const queryBuilder = this.carRepository.createQueryBuilder('car');

    if (params.type) {
      queryBuilder.andWhere('car.type = :type', { type: params.type });
    }

    if (params.model) {
      queryBuilder.andWhere('car.model = :model', { model: params.model });
    }

    if (params.lat && params.lng && params.radius) {
      queryBuilder.andWhere(
        `
        ST_Distance_Sphere(
          point(car.longitude, car.latitude),
          point(:lng, :lat)
        ) <= :radius
      `,
        { lat: params.lat, lng: params.lng, radius: params.radius },
      );
    }

    if (params.mileage) {
      queryBuilder.andWhere('car.mileage <= :mileage', {
        mileage: params.mileage,
      });
    }

    if (params.year) {
      queryBuilder.andWhere('car.year = :year', { year: params.year });
    }

    if (params.color) {
      queryBuilder.andWhere('car.color = :color', { color: params.color });
    }

    const results = await queryBuilder.getMany();
    if (results.length === 0) {
        this.loggerService.log(`No results found for the given query | TraceID: ${traceId}`);
      }
    this.loggerService.log(
      `Search completed with ${results.length} results | TraceID: ${traceId}`,
    );

    return results;
  }
}
