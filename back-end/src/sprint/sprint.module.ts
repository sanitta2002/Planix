import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';

@Module({
  providers: [SprintService],
})
export class SprintModule {}
