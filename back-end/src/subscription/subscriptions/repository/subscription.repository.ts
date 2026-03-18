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
    private readonly _subscriptionModel: Model<SubscriptionDocument>,
  ) {
    super(_subscriptionModel);
  }
  async findActiveByWorkspace(
    workspaceId: string,
  ): Promise<SubscriptionDocument | null> {
    return await this._subscriptionModel
      .findOne({
        workspaceId: new Types.ObjectId(workspaceId),
        status: {
          $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING],
        },
      })
      .populate('planId');
  }
  async findActiveByUser(userId: string): Promise<SubscriptionDocument | null> {
    return await this._subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
      status: SubscriptionStatus.ACTIVE,
      endDate: { $gt: new Date() },
    });
  }
  async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    return this._subscriptionModel.findOne({ stripeSubscriptionId });
  }
  async findAllPayments(): Promise<SubscriptionDocument[]> {
    return await this._subscriptionModel
      .find()
      .populate('userId', 'name email')
      .populate('planId', 'name price')
      .sort({ createdAt: -1 });
  }
}
