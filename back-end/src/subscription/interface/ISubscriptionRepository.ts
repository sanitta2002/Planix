import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { SubscriptionDocument } from '../Model/subscription.schema';

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionDocument> {
  findActiveByWorkspace(
    workspaceId: string,
  ): Promise<SubscriptionDocument | null>;
  findActiveByUser(userId: string): Promise<SubscriptionDocument | null>;
  findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<SubscriptionDocument | null>;
  findAllPayments(
    planId?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    page?: number,
    limit?: number,
  ): Promise<{ payments: SubscriptionDocument[]; total: number }>;
  findAllByWorkspace(workspaceId: string): Promise<SubscriptionDocument[]>;
}
