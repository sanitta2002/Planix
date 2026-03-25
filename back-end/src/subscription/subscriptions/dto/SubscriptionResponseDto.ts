import { SubscriptionStatus } from 'src/subscription/Model/subscription.schema';

export class SubscriptionResponseDto {
  id: string;
  userId: string;
  workspaceId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
}
