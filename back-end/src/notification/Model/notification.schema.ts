import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {  NotificationType } from 'src/common/type/NotificationType';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiver!: Types.ObjectId;

  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  notificationType!: NotificationType;

  @Prop({
    required: true,
  })
  message!: string;

  @Prop({
    type: Types.ObjectId,
  })
  referenceId!: Types.ObjectId;

  @Prop({
    default: false,
  })
  isRead!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
