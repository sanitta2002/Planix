import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { SubscriptionsModule } from 'src/subscription/subscriptions/subscriptions.module';
import { SubscriptionPlanModule } from 'src/subscription/subscription-plan/subscription-plan.module';

@Module({
  imports: [SubscriptionsModule, SubscriptionPlanModule],
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
