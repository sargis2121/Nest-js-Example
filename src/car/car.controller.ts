import { Controller, Get, Query, Req } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';
import { Request } from 'express';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('')
  async searchCars(
    @Req() req: Request,
    @Query('type') type?: string,
    @Query('model') model?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('radius') radius?: number,
    @Query('mileage') mileage?: number,
    @Query('year') year?: number,
    @Query('color') color?: string,
  ): Promise<Car[]> {
    const traceId = req['traceId'];

    return this.carService.searchCars(
      { type, model, lat, lng, radius, mileage, year, color },
      traceId,
    );
  }
}
