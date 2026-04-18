// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';

// @Schema({ timestamps: true })
// export class Attachment {
//   @Prop({
//     enum: ['link', 'file'],
//     required: true,
//   })
//   type!: string;

//   @Prop({ type: Types.ObjectId, ref: 'Issue', required: true })
//   issueId!: Types.ObjectId;

//   @Prop({
//     required: true,
//   })
//   url!: string;

//   @Prop()
//   fileName?: string;
// }
// export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
