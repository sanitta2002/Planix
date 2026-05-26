import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { SubscriptionPlanDocument } from '@/subscription/Model/SubscriptionPlan.shema';

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlanDocument> {
  findAll(): Promise<SubscriptionPlanDocument[]>;
  findActivePlans(): Promise<SubscriptionPlanDocument[]>;
  findByStripePriceId(
    stripePriceId: string,
  ): Promise<SubscriptionPlanDocument | null>;
  findByStripeProductId(
    stripeProductId: string,
  ): Promise<SubscriptionPlanDocument | null>;
}
