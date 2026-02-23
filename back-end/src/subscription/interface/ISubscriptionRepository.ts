import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import {
  SubscriptionDocument,
  SubscriptionStatus,
} from '../Model/subscription.schema';

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionDocument> {
  findActiveByWorkspace(
    workspaceId: string,
  ): Promise<SubscriptionDocument | null>;
  findActiveByUser(userId: string): Promise<SubscriptionDocument | null>;
  updateStatus(
    id: string,
    status: SubscriptionStatus,
  ): Promise<SubscriptionDocument | null>;
  findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<SubscriptionDocument | null>;
}
