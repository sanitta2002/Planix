import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsService } from '@/subscription/subscriptions/service/subscriptions.service';
import { SubscriptionController } from '@/subscription/subscriptions/controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubcriptionSchema,
  Subscription,
} from '@/subscription/Model/subscription.schema';
import { subscriptionRepository } from '@/subscription/subscriptions/repository/subscription.repository';
import { SubscriptionPlanModule } from '@/subscription/subscription-plan/subscription-plan.module';
import { WorkspaceModule } from '@/workspace/workspace.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubcriptionSchema },
    ]),
    SubscriptionPlanModule,
    forwardRef(() => WorkspaceModule),
  ],
  providers: [
    {
      provide: 'ISubscriptionRepository',
      useClass: subscriptionRepository,
    },
    {
      provide: 'ISubscriptionService',
      useClass: SubscriptionsService,
    },
  ],
  controllers: [SubscriptionController],
  exports: ['ISubscriptionService', 'ISubscriptionRepository'],
})
export class SubscriptionsModule {}
