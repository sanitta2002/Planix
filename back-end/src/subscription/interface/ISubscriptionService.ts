import { CreateSubscriptionDto } from '../subscriptions/dto/CreateSubscriptionDto';
import { SubscriptionResponseDto } from '../subscriptions/dto/SubscriptionResponseDto';

export interface ISubscriptionService {
  createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto>;
  getActiveSubscription(userId: string): Promise<SubscriptionResponseDto>;
}
