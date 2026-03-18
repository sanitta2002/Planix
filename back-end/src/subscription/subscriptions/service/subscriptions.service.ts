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
import type { IWorkspaceRepository } from 'src/workspace/interface/IWorkspaceRepository';

@Injectable()
export class SubscriptionsService implements ISubscriptionService {
  private readonly _logger = new Logger(SubscriptionsService.name);
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepo: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepo: ISubscriptionPlanRepository,
    @Inject('IWorkspaceRepository')
    private readonly _workspaceRepository: IWorkspaceRepository,
  ) {}

  async getActiveSubscription(
    userId: string,
  ): Promise<SubscriptionResponseDto> {
    this._logger.log(`fetch active subs for user: ${userId}`);
    const subscription = await this._subscriptionRepo.findActiveByUser(userId);
    console.log(subscription);

    if (!subscription) {
      throw new NotFoundException('no active subscription found');
    }
    if (subscription.endDate && subscription.endDate < new Date()) {
      await this._subscriptionRepo.updateById(subscription._id.toString(), {
        status: SubscriptionStatus.EXPIRED,
      });

      throw new BadRequestException('Subscription expired');
    }
    return SubscriptionMapper.toResponseDto(subscription);
  }

  async createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    console.log(dto.planId);
    console.log(dto.workspaceId);
    this._logger.log(`plan id : ${dto.planId}`);

    const plan = await this._subscriptionPlanRepo.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    const active = await this._subscriptionRepo.findActiveByWorkspace(
      dto.workspaceId,
    );
    if (active) {
      throw new BadRequestException('workspace already  active subscription');
    }

    const subscription = await this._subscriptionRepo.create({
      userId: new Types.ObjectId(userId),
      workspaceId: new Types.ObjectId(dto.workspaceId),
      planId: new Types.ObjectId(dto.planId),
      status: SubscriptionStatus.PENDING,
    });
    console.log(subscription);
    return SubscriptionMapper.toResponseDto(subscription);
  }

  async makeactivateSubscription(
    subscriptionId: string,
    stripeSubscriptionId: string,
  ): Promise<SubscriptionResponseDto> {
    this._logger.log(`activating subs: ${subscriptionId}`);

    const subscription = await this._subscriptionRepo.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('subscription already active');
    }
    const plan = await this._subscriptionPlanRepo.findById(
      subscription.planId.toString(),
    );
    if (!plan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const updated = await this._subscriptionRepo.updateById(subscriptionId, {
      status: SubscriptionStatus.ACTIVE,
      startDate: startDate,
      endDate: endDate,
      stripeSubscriptionId: stripeSubscriptionId,
    });

    console.log('subsription', subscription.workspaceId.toString());
    if (!updated) {
      throw new NotFoundException('subscription update failed');
    }
    await this._workspaceRepository.updateById(
      subscription.workspaceId.toString(),
      {
        subscriptionStatus: 'active',
      },
    );
    this._logger.log(`sub activated successfully: ${subscriptionId}`);

    return SubscriptionMapper.toResponseDto(updated);
  }

  async upgradeSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const plan = await this._subscriptionPlanRepo.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    const existing = await this._subscriptionRepo.findActiveByWorkspace(
      dto.workspaceId,
    );

    if (!existing) {
      throw new BadRequestException('No subscription found for this workspace');
    }

    if (existing.status === SubscriptionStatus.ACTIVE) {
      await this._subscriptionRepo.updateById(existing._id.toString(), {
        status: SubscriptionStatus.EXPIRED,
        endDate: new Date(),
      });
    }
    const newSubscription = await this._subscriptionRepo.create({
      userId: new Types.ObjectId(userId),
      workspaceId: new Types.ObjectId(dto.workspaceId),
      planId: new Types.ObjectId(dto.planId),
      status: SubscriptionStatus.PENDING,
    });
    return SubscriptionMapper.toResponseDto(newSubscription);
  }
}
