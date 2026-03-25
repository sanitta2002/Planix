import { Module } from '@nestjs/common';
import { HashingService } from './Service/hashing.service';

@Module({
  providers: [
    {
      provide: 'IHashingService',
      useClass: HashingService,
    },
  ],
  exports: ['IHashingService'],
})
export class HashingModule {}
