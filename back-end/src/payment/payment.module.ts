import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
