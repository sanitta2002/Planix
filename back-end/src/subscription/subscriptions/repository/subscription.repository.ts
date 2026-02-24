import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ISubscriptionRepository } from 'src/subscription/interface/ISubscriptionRepository';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionStatus,
} from 'src/subscription/Model/subscription.schema';
import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';

@Injectable()
export class subscriptionRepository
  extends BaseRepository<SubscriptionDocument>
  implements ISubscriptionRepository
{
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {
    super(subscriptionModel);
  }
  async findActiveByWorkspace(
    workspaceId: string,
  ): Promise<SubscriptionDocument | null> {
    return await this.subscriptionModel.findOne({
      workspaceId: new Types.ObjectId(workspaceId),
      status: SubscriptionStatus.ACTIVE,
      endDate: { $gt: new Date() },
    });
  }
  async findActiveByUser(userId: string): Promise<SubscriptionDocument | null> {
    return await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
      status: SubscriptionStatus.ACTIVE,
      endDate: { $gt: new Date() },
    });
  }
  async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return this.subscriptionModel.findOne({ stripeSubscriptionId });
  }
}
