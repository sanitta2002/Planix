import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  projectName!: string;

  @Prop({
    required: true,
    trim: true,
    uppercase: true,
  })
  key!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspaceId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: Number,
    default: 0,
  })
  issueCounter!: number;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ workspaceId: 1, key: 1 }, { unique: true });
