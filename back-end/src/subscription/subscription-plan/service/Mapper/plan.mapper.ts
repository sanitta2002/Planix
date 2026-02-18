import { SubscriptionPlanDocument } from 'src/subscription/Model/SubscriptionPlan.shema';
import { PlanResponseDto } from '../../dto/res/PlanResponseDTO';

export class planMapper {
  static toResponse(plan: SubscriptionPlanDocument): PlanResponseDto {
    return {
      id: plan._id.toString(),
      name: plan.name,
      price: plan.price,
      maxMembers: plan.maxMembers,
      maxProjects: plan.maxProjects,
      features: plan.features,
      stripeProductId: plan.stripeProductId,
      stripePriceId: plan.stripePriceId,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
  static toResponseList(plans: SubscriptionPlanDocument[]): PlanResponseDto[] {
    return plans.map((plan) => this.toResponse(plan));
  }
}
