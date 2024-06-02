import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSnapshotService } from './job-snapshot.service';
import { JobSnapshot, JobSnapshotSchema } from './schemas/job-snapshot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobSnapshot.name, schema: JobSnapshotSchema },
    ]),
  ],
  providers: [JobSnapshotService],
})
export class JobSnapshotModule {}
