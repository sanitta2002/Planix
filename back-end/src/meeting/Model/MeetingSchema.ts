import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { MeetingStatus } from '@/common/type/MeetingStatus';
import { MeetingType } from '@/common/type/MeetingType';

export type MeetingDocument = HydratedDocument<Meeting> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Meeting {
  @Prop({
    required: true,
    trim: true,
  })
  title!: string;

  @Prop({
    default: null,
  })
  description?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true,
  })
  workspaceId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true,
  })
  projectId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  startTime!: Date;

  @Prop({
    required: true,
  })
  endTime!: Date;

  @Prop({
    enum: MeetingStatus,
    default: MeetingStatus.SCHEDULED,
    index: true,
  })
  status!: MeetingStatus;

  @Prop({
    enum: MeetingType,
    default: MeetingType.ONLINE,
  })
  meetingType!: MeetingType;

  @Prop({
    default: null,
  })
  location?: string;

  @Prop({
    required: true,
    unique: true,
  })
  roomId!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  hostId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  attendees!: Types.ObjectId[];

  @Prop({
    default: null,
  })
  notes?: string;

  @Prop({
    type: Date,
    default: null,
  })
  startedAt?: Date;

  @Prop({
    type: Date,
    default: null,
  })
  endedAt?: Date;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
