export class PlanResponseDto {
  id: string;
  name: string;
  price: number;
  maxMembers: number;
  maxProjects: number;
  features: string[];
  stripeProductId?: string;
  stripePriceId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
