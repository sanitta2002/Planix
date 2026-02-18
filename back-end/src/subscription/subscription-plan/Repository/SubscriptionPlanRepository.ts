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
    private readonly subscriptionPlanModel: Model<SubscriptionPlanDocument>,
  ) {
    super(subscriptionPlanModel);
  }

  async findAll(): Promise<SubscriptionPlanDocument[]> {
    return await this.subscriptionPlanModel.find();
  }

  async findActivePlans(): Promise<SubscriptionPlanDocument[]> {
    return await this.subscriptionPlanModel.find({ isActive: true });
  }

  async findByStripePriceId(
    stripePriceId: string,
  ): Promise<SubscriptionPlanDocument | null> {
    return await this.subscriptionPlanModel.findOne({ stripePriceId });
  }

  async findByStripeProductId(
    stripeProductId: string,
  ): Promise<SubscriptionPlanDocument | null> {
    return await this.subscriptionPlanModel.findOne({ stripeProductId });
  }
}
