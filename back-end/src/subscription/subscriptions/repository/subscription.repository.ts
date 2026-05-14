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
  async findAllPayments(
    planId?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    page?: number,
    limit?: number,
  ): Promise<{ payments: SubscriptionDocument[]; total: number }> {
    const filter: {
      planId?: Types.ObjectId;
      status?: string;
      startDate?: { $gte?: Date; $lte?: Date };
    } = {};

    if (planId && planId.trim() !== '' && Types.ObjectId.isValid(planId)) {
      filter.planId = new Types.ObjectId(planId);
    }

    if (status && status.trim() !== '') {
      filter.status = status;
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (
        (start && !isNaN(start.getTime())) ||
        (end && !isNaN(end.getTime()))
      ) {
        filter.startDate = {};
        if (start && !isNaN(start.getTime())) {
          filter.startDate.$gte = start;
        }
        if (end && !isNaN(end.getTime())) {
          filter.startDate.$lte = end;
        }
      }
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const [payments, total] = await Promise.all([
      this._subscriptionModel
        .find(filter)
        .populate('userId', 'name email')
        .populate('planId', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit || 0),
      this._subscriptionModel.countDocuments(filter),
    ]);

    return { payments, total };
  }
  async findAllByWorkspace(
    workspaceId: string,
  ): Promise<SubscriptionDocument[]> {
    return await this._subscriptionModel
      .find({ workspaceId: new Types.ObjectId(workspaceId) })
      .populate('planId', 'name price durationDays')
      .sort({ createdAt: -1 });
  }
}
