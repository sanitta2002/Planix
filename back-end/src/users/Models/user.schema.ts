import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, MinLength } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
  @Prop()
  phone: string;
  @Prop({required:false})
  @IsString()
  @MinLength(6)
  password: string;
  @Prop({ default: false })
  isBlocked: boolean;
  @Prop()
  avatarUrl?: string;
  @Prop({ default: false })
  isEmailVerified: boolean;
  @Prop()
  lastSeenAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
