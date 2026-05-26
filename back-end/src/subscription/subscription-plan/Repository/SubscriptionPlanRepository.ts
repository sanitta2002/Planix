import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISubscriptionPlanRepository } from '@/subscription/interface/ISubscriptionPlanRepository';
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from '@/subscription/Model/SubscriptionPlan.shema';
import { BaseRepository } from '@/users/repository/BaseRepo/BaseRepo';

@Injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<SubscriptionPlanDocument>
  implements ISubscriptionPlanRepository
{
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly _subscriptionPlanModel: Model<SubscriptionPlanDocument>,
  ) {
    super(_subscriptionPlanModel);
  }

  async findAll(): Promise<SubscriptionPlanDocument[]> {
    return await this._subscriptionPlanModel.find({ isDeleted: { $ne: true } });
  }

  async findActivePlans(): Promise<SubscriptionPlanDocument[]> {
    return await this._subscriptionPlanModel.find({
      isActive: true,
      isDeleted: { $ne: true },
    });
  }

  async findByStripePriceId(
    stripePriceId: string,
  ): Promise<SubscriptionPlanDocument | null> {
    return await this._subscriptionPlanModel.findOne({ stripePriceId });
  }

  async findByStripeProductId(
    stripeProductId: string,
  ): Promise<SubscriptionPlanDocument | null> {
    return await this._subscriptionPlanModel.findOne({ stripeProductId });
  }
}
