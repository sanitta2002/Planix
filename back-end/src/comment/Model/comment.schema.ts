import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    type: Types.ObjectId,
    ref: 'Issue',
    required: true,
    index: true,
  })
  issueId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  content!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  mentions!: Types.ObjectId[];

  @Prop({
    default: false,
    index: true,
  })
  isDeleted!: boolean;

  @Prop({
    default: false,
  })
  isEdited!: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
