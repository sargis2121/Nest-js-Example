import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarSeedService } from './car-seed.service';
import { LoggerService } from 'src/common/logging/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarController],
  providers: [CarService, CarSeedService,LoggerService],
  exports: [CarService, CarSeedService],
})
export class CarModule {}
