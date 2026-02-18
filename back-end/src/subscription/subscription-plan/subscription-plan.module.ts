import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './service/subscription-plan.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from '../Model/SubscriptionPlan.shema';
import { SubscriptionPlanRepository } from './Repository/SubscriptionPlanRepository';
import { SubPlanController } from './controller/sub-plan.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
  ],
  controllers: [SubPlanController],
  providers: [
    {
      provide: 'ISubscriptionPlanRepository',
      useClass: SubscriptionPlanRepository,
    },
    {
      provide: 'ISubscriptionPlanService',
      useClass: SubscriptionPlanService,
    },
  ],
  exports: ['ISubscriptionPlanService'],
})
export class SubscriptionPlanModule {}
