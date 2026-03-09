import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['owner', 'member'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  members: {
    user: Types.ObjectId;
    role: 'owner' | 'member';
    joinedAt: Date;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  subscriptionId?: Types.ObjectId;

  @Prop()
  logo?: string;

  @Prop({
    enum: ['pending', 'active', 'expired'],
    default: 'pending',
  })
  subscriptionStatus: string;

  @Prop({ default: false })
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
