import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;
export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}
@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  planId: Types.ObjectId;

  @Prop()
  stripeSubscriptionId?: string;

  @Prop()
  stripeCustomerId?: string;

  @Prop()
  stripePriceId?: string;

  @Prop()
  latestInvoiceId?: string;

  @Prop({ enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  cancelledAt?: Date;
}

export const SubcriptionSchema = SchemaFactory.createForClass(Subscription);
