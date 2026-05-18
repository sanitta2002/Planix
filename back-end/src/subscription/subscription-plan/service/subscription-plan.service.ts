import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ISubscriptionPlanRepository } from '@/subscription/interface/ISubscriptionPlanRepository';
import { ISubscriptionPlanService } from '@/subscription/interface/ISubscriptionPlanService';
import { CreatePlanDto } from '@/subscription/subscription-plan/dto/req/createplan.dto';
import { PlanResponseDto } from '@/subscription/subscription-plan/dto/res/PlanResponseDTO';
import { planMapper } from '@/subscription/subscription-plan/service/Mapper/plan.mapper';
import { UpdatePlanDto } from '@/subscription/subscription-plan/dto/req/UpdatePlanDto';
import { SUBSCRIPTION_MESSAGE } from '@/common/constants/messages.constant';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    private readonly _logger: PinoLogger,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}
  async createPlan(data: CreatePlanDto): Promise<PlanResponseDto> {
    this._logger.info(`create sub plan :${data.name}`);
    const plan = await this._subscriptionPlanRepository.create(data);
    return planMapper.toResponse(plan);
  }

  async getAllPlans(): Promise<PlanResponseDto[]> {
    this._logger.info(`fetch all sub plans`);
    const plans = await this._subscriptionPlanRepository.findAll();
    return planMapper.toResponseList(plans);
  }

  async updatePlan(
    planId: string,
    data: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    this._logger.info(`update plan : ${planId}`);
    console.log(planId);
    const updatePlan = await this._subscriptionPlanRepository.updateById(
      planId,
      data,
    );
    if (!updatePlan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    return planMapper.toResponse(updatePlan);
  }

  async deletePlan(planId: string): Promise<void> {
    this._logger.info(`delete plan : ${planId}`);
    await this._subscriptionPlanRepository.deleteById(planId);
  }
  async getActivePlans(): Promise<PlanResponseDto[]> {
    this._logger.info(`fetch active subscription plans`);

    const plans = await this._subscriptionPlanRepository.findActivePlans();

    return planMapper.toResponseList(plans);
  }

  async getPlanById(planId: string): Promise<PlanResponseDto> {
    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    return planMapper.toResponse(plan);
  }
}
