import { CreatePlanDto } from '../subscription-plan/dto/req/createplan.dto';
import { UpdatePlanDto } from '../subscription-plan/dto/req/UpdatePlanDto';
import { PlanResponseDto } from '../subscription-plan/dto/res/PlanResponseDTO';

export interface ISubscriptionPlanService {
  createPlan(data: CreatePlanDto): Promise<PlanResponseDto>;
  getAllPlans(): Promise<PlanResponseDto[]>;
  updatePlan(planId: string, data: UpdatePlanDto): Promise<PlanResponseDto>;
  deletePlan(planId: string): Promise<void>;
}
