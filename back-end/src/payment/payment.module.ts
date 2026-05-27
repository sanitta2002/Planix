import { Module } from '@nestjs/common';
import { PaymentService } from '@/payment/service/payment.service';
import { PaymentController } from '@/payment/controller/payment.controller';
import { SubscriptionsModule } from '@/subscription/subscriptions/subscriptions.module';
import { SubscriptionPlanModule } from '@/subscription/subscription-plan/subscription-plan.module';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [SubscriptionsModule, SubscriptionPlanModule, LoggerModule],
  providers: [
    {
      provide: 'IPaymentService',
      useClass: PaymentService,
    },
  ],
  controllers: [PaymentController],
  exports: ['IPaymentService'],
})
export class PaymentModule {}
