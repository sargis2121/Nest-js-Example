import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { LoggerService } from 'src/common/logging/logger/logger.service';
import { ElasticsearchService } from 'src/common/elasticsearch/elasticsearch.service';

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
    private readonly elasticsearchService: ElasticsearchService, // Elasticsearch Service injected
  ) {}

  async searchCars(params: SearchParams, traceId: string): Promise<any[]> {
    this.loggerService.log(
      `Search initiated with params: ${JSON.stringify(params)} | TraceID: ${traceId}`,
    );

    // Prepare Elasticsearch query
    const elasticQuery: any = {
      bool: {
        must: [],
        filter: [],
      },
    };

    if (params.type) {
      elasticQuery.bool.must.push({
        match: { type: params.type },
      });
    }

    if (params.model) {
      elasticQuery.bool.must.push({
        match: { model: params.model },
      });
    }

    if (params.mileage) {
      elasticQuery.bool.filter.push({
        range: { mileage: { lte: params.mileage } },
      });
    }

    if (params.year) {
      elasticQuery.bool.filter.push({
        term: { year: params.year },
      });
    }

    if (params.color) {
      elasticQuery.bool.filter.push({
        term: { color: params.color },
      });
    }

    // Geo-based query
    if (params.lat && params.lng && params.radius) {
      elasticQuery.bool.filter.push({
        geo_distance: {
          distance: `${params.radius}km`,
          location: { // Assuming you have 'location' field as geo_point in Elasticsearch
            lat: params.lat,
            lon: params.lng,
          },
        },
      });
    }

    // Search in Elasticsearch
    const elasticsearchResult = await this.elasticsearchService.search('cars', {
      query: elasticQuery,
    });

    const hits = elasticsearchResult.hits.hits.map((hit: any) => hit._source); // Use the hits directly

    this.loggerService.log(
      `Search completed with ${hits.length} Elasticsearch results | TraceID: ${traceId}`,
    );

    return hits;
  }

  // Optionally, if you want to sync Elasticsearch with your relational database
  async indexCar(car: Car): Promise<void> {
    await this.elasticsearchService.indexDocument('cars', car.id.toString(), car);
  }

  async deleteCarFromIndex(carId: string): Promise<void> {
    await this.elasticsearchService.deleteDocument('cars', carId);
  }

  // For non-search specific operations, use TypeORM
  async findOne(id: number): Promise<Car> {
    return this.carRepository.findOne({ where: { id } });
  }

  async createCar(carData: Partial<Car>): Promise<Car> {
    const car = this.carRepository.create(carData);
    const savedCar = await this.carRepository.save(car);

    // Index the car in Elasticsearch after saving
    await this.indexCar(savedCar);

    return savedCar;
  }

  async deleteCar(id: string): Promise<void> {
    await this.carRepository.delete(id);
    await this.deleteCarFromIndex(id); // Delete from Elasticsearch as well
  }
}
