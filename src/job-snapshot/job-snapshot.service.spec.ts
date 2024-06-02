import { Test, TestingModule } from '@nestjs/testing';
import { JobSnapshotService } from './job-snapshot.service';

describe('JobSnapshotService', () => {
  let service: JobSnapshotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobSnapshotService],
    }).compile();

    service = module.get<JobSnapshotService>(JobSnapshotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
