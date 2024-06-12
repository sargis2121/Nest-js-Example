import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { ConfigService } from '@nestjs/config';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private configService: ConfigService,
  ) {}

  @Post()
  async create(
    @Body('clientId') clientId: string,
    // @Headers('x-api-key') apiKey: string,
  ) {
    // if (apiKey !== this.configService.get<string>('API_KEY')) {
    //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // }
    return this.jobService.create(clientId);
  }
}
