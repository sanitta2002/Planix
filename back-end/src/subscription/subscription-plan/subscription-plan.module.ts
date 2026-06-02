import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionPlanService } from '@/subscription/subscription-plan/service/subscription-plan.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from '@/subscription/Model/SubscriptionPlan.shema';
import { SubscriptionPlanRepository } from '@/subscription/subscription-plan/Repository/SubscriptionPlanRepository';
import { SubPlanController } from '@/subscription/subscription-plan/controller/sub-plan.controller';
import { LoggerModule } from '@/logger/logger.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    LoggerModule,
    forwardRef(() => SubscriptionsModule),
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
  exports: ['ISubscriptionPlanService', 'ISubscriptionPlanRepository'],
})
export class SubscriptionPlanModule {}
