import { Module } from '@nestjs/common';
import { StripeService } from '@/common/stripe/stripe.service';

@Module({
  providers: [StripeService],
})
export class StripeModule {}
