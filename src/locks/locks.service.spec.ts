import { Test, TestingModule } from '@nestjs/testing';
import { LocksService } from './locks.service';

describe('LocksService', () => {
  let service: LocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocksService],
    }).compile();

    service = module.get<LocksService>(LocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
