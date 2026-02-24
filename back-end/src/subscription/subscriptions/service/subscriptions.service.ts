import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(SubscriptionsService.name);
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepo: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly subscriptionPlanRepo: ISubscriptionPlanRepository,
  ) {}

  async getActiveSubscription(
    userId: string,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`fetch active subs for user: ${userId}`);
    const subscription = await this.subscriptionRepo.findActiveByUser(userId);
    console.log(subscription);

    if (!subscription) {
      throw new NotFoundException('no active subscription found');
    }
    return SubscriptionMapper.toResponseDto(subscription);
  }

  async createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    console.log(dto.planId);
    console.log(dto.workspaceId);

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
    });
    return SubscriptionMapper.toResponseDto(subscription);
  }

  async makeactivateSubscription(
    subscriptionId: string,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(`activating subs: ${subscriptionId}`);

    const subscription = await this.subscriptionRepo.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('subscription already active');
    }
    const updated = await this.subscriptionRepo.updateById(subscriptionId, {
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
    });
    if (!updated) {
      throw new NotFoundException('subscription update failed');
    }
    this.logger.log(`sub activated successfully: ${subscriptionId}`);

    return SubscriptionMapper.toResponseDto(updated);
  }
}
