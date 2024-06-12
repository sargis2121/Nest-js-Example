import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule'; 
import { JobService } from './job/job.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jobService: JobService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async callJobCreate() {
    const apiKey = randomBytes(16).toString('hex');
    const result = await this.jobService.create(apiKey);
    console.log('Job created:', result);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
