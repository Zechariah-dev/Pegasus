import { Module } from '@nestjs/common';
import { LocksService } from './locks.service';

@Module({
  providers: [LocksService]
})
export class LocksModule {}
