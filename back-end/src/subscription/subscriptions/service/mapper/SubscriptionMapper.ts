import { SubscriptionDocument } from 'src/subscription/Model/subscription.schema';
import { SubscriptionResponseDto } from '../../dto/SubscriptionResponseDto';

export class SubscriptionMapper {
  static toResponseDto(
    subscription: SubscriptionDocument,
  ): SubscriptionResponseDto {
    return {
      id: subscription._id.toString(),
      userId: subscription.userId.toString(),
      workspaceId: subscription.workspaceId.toString(),
      planId: subscription.planId.toString(),
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate ?? undefined,
    };
  }
}
