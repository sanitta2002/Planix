import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SprintStatus } from 'src/common/type/SprintStatus';

export type SprintDocument = HydratedDocument<Sprint> & {
  createdAt: Date;
};

@Schema({ timestamps: true })
export class Sprint {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: false })
  startDate!: Date;

  @Prop({ required: false })
  endDate!: Date;

  @Prop({
    enum: SprintStatus,
    default: SprintStatus.PLANNED,
    index: true,
  })
  status!: SprintStatus;

  @Prop()
  goal?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
