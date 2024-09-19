import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealthStatus(): string {
    return 'Service is running';
  }
}
