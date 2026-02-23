import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ISubscriptionPlanRepository } from 'src/subscription/interface/ISubscriptionPlanRepository';
import type { ISubscriptionRepository } from 'src/subscription/interface/ISubscriptionRepository';
import { ISubscriptionService } from 'src/subscription/interface/ISubscriptionService';
import { CreateSubscriptionDto } from '../dto/CreateSubscriptionDto';
import { SubscriptionResponseDto } from '../dto/SubscriptionResponseDto';
import { SUBSCRIPTION_MESSAGE } from 'src/common/constants/messages.constant';
import { SubscriptionMapper } from './mapper/SubscriptionMapper';
import { Types } from 'mongoose';
import { SubscriptionStatus } from 'src/subscription/Model/subscription.schema';

@Injectable()
export class SubscriptionsService implements ISubscriptionService {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepo: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly subscriptionPlanRepo: ISubscriptionPlanRepository,
  ) {}

  async getActiveSubscription(
    userId: string,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepo.findActiveByUser(userId);
    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }
    return SubscriptionMapper.toResponseDto(subscription);
  }

  async createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const plan = await this.subscriptionPlanRepo.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    const active = await this.subscriptionRepo.findActiveByWorkspace(
      dto.workspaceId,
    );
    if (active) {
      throw new BadRequestException('workspace already  active subscription');
    }

    const subscription = await this.subscriptionRepo.create({
      userId: new Types.ObjectId(userId),
      workspaceId: new Types.ObjectId(dto.workspaceId),
      planId: new Types.ObjectId(dto.planId),
      status: SubscriptionStatus.PENDING,
      // startDate: new Date(),
    });
    return SubscriptionMapper.toResponseDto(subscription);
  }
}
