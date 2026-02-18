import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ISubscriptionPlanRepository } from '../../interface/ISubscriptionPlanRepository';
import { ISubscriptionPlanService } from 'src/subscription/interface/ISubscriptionPlanService';
import { CreatePlanDto } from '../dto/req/createplan.dto';
import { PlanResponseDto } from '../dto/res/PlanResponseDTO';
import { planMapper } from './Mapper/plan.mapper';
import { UpdatePlanDto } from '../dto/req/UpdatePlanDto';
import { SUBSCRIPTION_MESSAGE } from 'src/common/constants/messages.constant';

@Injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  private readonly logger = new Logger(SubscriptionPlanService.name);
  constructor(
    @Inject('ISubscriptionPlanRepository')
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}
  async createPlan(data: CreatePlanDto): Promise<PlanResponseDto> {
    this.logger.log(`create sub plan :${data.name}`);
    const plan = await this.subscriptionPlanRepository.create(data);
    return planMapper.toResponse(plan);
  }
  async getAllPlans(): Promise<PlanResponseDto[]> {
    this.logger.log(`fetch all sub plans`);
    const plans = await this.subscriptionPlanRepository.findAll();
    return planMapper.toResponseList(plans);
  }
  async updatePlan(
    planId: string,
    data: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    this.logger.log(`update plan : ${planId}`);
    const updatePlan = await this.subscriptionPlanRepository.updateById(
      planId,
      data,
    );
    if (!updatePlan) {
      throw new NotFoundException(SUBSCRIPTION_MESSAGE.NOT_FOUND);
    }
    return planMapper.toResponse(updatePlan);
  }
  async deletePlan(planId: string): Promise<void> {
    this.logger.log(`delete plan : ${planId}`);
    await this.subscriptionPlanRepository.deleteById(planId);
  }
}
