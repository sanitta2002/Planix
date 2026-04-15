import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { IssueStatus } from 'src/common/type/IssueStatus';
import { IssueType } from 'src/common/type/IssueType';

export interface IAttachment {
  type: string;
  url: string;
  fileName?: string;
}

export type IssueDocument = HydratedDocument<Issue> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Issue {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Issue', default: null, index: true })
  parentId!: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'Sprint', default: null, index: true })
  sprintId!: Types.ObjectId | null;

  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ default: null })
  description?: string;

  @Prop({ enum: IssueType, required: true, index: true })
  issueType!: IssueType;

  @Prop({ enum: IssueStatus, default: IssueStatus.TODO, index: true })
  status!: IssueStatus;

  @Prop({
    type: [
      {
        type: { type: String },
        url: { type: String },
        fileName: { type: String },
      },
    ],
    default: [],
  })
  attachments!: {
    type: string;
    url: string;
    fileName?: string;
  }[];

  @Prop({ type: String, default: null })
  assigneeId?: string | null;

  @Prop({ default: null })
  startDate?: Date;

  @Prop({ default: null })
  endDate?: Date;

  @Prop({ required: true })
  createdBy!: string;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
