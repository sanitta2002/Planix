import { Module } from '@nestjs/common';
import { S3Service } from '@/common/s3/s3.service';

@Module({
  providers: [
    {
      provide: 'IS3Service',
      useClass: S3Service,
    },
  ],
  exports: ['IS3Service'],
})
export class S3Module {}
