import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '@nestjs/redis';
import { RedisClientType } from 'redis';
import { JobSnapshot } from './schemas/job-snapshot.schema';

@Injectable()
export class JobSnapshotService implements OnModuleInit {
  private redisClient: RedisClientType;

  constructor(
    @InjectModel(JobSnapshot.name) private jobSnapshotModel: Model<JobSnapshot>,
    private redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async onModuleInit() {
    await this.redisClient.subscribe('job_started', (message) => {
      const job = JSON.parse(message);
      this.handleJobStartedEvent(job);
    });
  }

  async handleJobStartedEvent(payload: any) {
    const jobSnapshot = new this.jobSnapshotModel({
      timestamp: new Date(),
      clientId: payload.clientId,
    });
    await jobSnapshot.save();
  }
}
