import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISubscriptionPlanRepository } from 'src/subscription/interface/ISubscriptionPlanRepository';
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from 'src/subscription/Model/SubscriptionPlan.shema';
import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';

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
    return await this._subscriptionPlanModel.find();
  }

  async findActivePlans(): Promise<SubscriptionPlanDocument[]> {
    return await this._subscriptionPlanModel.find({ isActive: true });
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
