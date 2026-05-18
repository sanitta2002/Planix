import { SubscriptionPlanDocument } from '@/subscription/Model/SubscriptionPlan.shema';
import { PlanResponseDto } from '@/subscription/subscription-plan/dto/res/PlanResponseDTO';

export class planMapper {
  static toResponse(plan: SubscriptionPlanDocument): PlanResponseDto {
    return {
      id: plan._id.toString(),
      name: plan.name,
      price: plan.price,
      maxMembers: plan.maxMembers,
      maxProjects: plan.maxProjects,
      features: plan.features,
      durationDays: plan.durationDays,
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
