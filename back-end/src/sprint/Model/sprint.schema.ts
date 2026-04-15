import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SprintStatus } from 'src/common/type/SprintStatus';

export type SprintDocument = Sprint & Document;

@Schema({ timestamps: true })
export class Sprint {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({
    enum: SprintStatus,
    default: SprintStatus.PLANNED,
    index: true,
  })
  status!: SprintStatus;

  @Prop()
  goal?: string;

  @Prop({ required: true })
  createdBy!: string;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
