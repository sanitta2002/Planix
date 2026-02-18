import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './Model/SubscriptionPlan.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
  ],
  providers: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
