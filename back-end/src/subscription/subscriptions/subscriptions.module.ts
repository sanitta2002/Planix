import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsService } from './service/subscriptions.service';
import { SubscriptionController } from './controller/controller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcriptionSchema, Subscription } from '../Model/subscription.schema';
import { subscriptionRepository } from './repository/subscription.repository';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

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
