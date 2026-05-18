import { CreateSubscriptionDto } from '@/subscription/subscriptions/dto/CreateSubscriptionDto';
import { SubscriptionResponseDto } from '@/subscription/subscriptions/dto/SubscriptionResponseDto';

export interface ISubscriptionService {
  createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto>;
  getActiveSubscription(userId: string): Promise<SubscriptionResponseDto>;
  makeactivateSubscription(
    subscriptionId: string,
    stripeSubscriptionId: string,
  ): Promise<SubscriptionResponseDto>;
  upgradeSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto>;
}
