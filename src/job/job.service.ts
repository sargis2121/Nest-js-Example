import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { RedisService } from '@nestjs/redis';
import { RedisClientType } from 'redis';

@Injectable()
export class JobService {
  private redisClient: RedisClientType;

  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    private redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async create(clientId: string): Promise<Job> {
    const job = this.jobRepository.create({ clientId });
    await this.jobRepository.save(job);
    await this.redisClient.publish('job_started', JSON.stringify(job));
    return job;
  }
}
