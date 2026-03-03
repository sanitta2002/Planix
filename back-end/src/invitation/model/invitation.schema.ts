import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    enum: ['owner', 'member'],
    default: 'member',
  })
  role: string;

  @Prop({
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;
}
export const InvitationSchema = SchemaFactory.createForClass(Invitation);
