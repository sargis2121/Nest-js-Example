import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService,  } from '@liaoliaots/nestjs-redis';
import { JobSnapshot } from './schemas/job-snapshot.schema';
import Redis from 'ioredis';

@Injectable()
export class JobSnapshotService implements OnModuleInit {
  private redisClient: Redis;

  constructor(
    @InjectModel(JobSnapshot.name) private jobSnapshotModel: Model<JobSnapshot>,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.redisClient = this.redisService.getClient();
    this.redisClient.subscribe('job_started', (err, count) => {
      if (err) {
        console.error('Failed to subscribe: ', err);
      } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
      }
    });

    this.redisClient.on('message', (channel, message) => {
      if (channel === 'job_started') {
        const job = JSON.parse(message);
        this.handleJobStartedEvent(job);
      }
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
