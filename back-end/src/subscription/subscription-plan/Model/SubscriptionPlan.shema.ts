import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionPlanDocument = SubscriptionPlan & Document;
@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  maxMembers: number;

  @Prop({ required: true })
  maxProjects: number;

  @Prop({ default: null })
  stripeProductId?: string;

  @Prop({ default: null })
  stripePriceId?: string;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
