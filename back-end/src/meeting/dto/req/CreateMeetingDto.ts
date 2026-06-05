import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { MeetingType } from '@/common/type/MeetingType';

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsEnum(MeetingType)
  @IsOptional()
  meetingType?: MeetingType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsArray()
  @IsOptional()
  attendeeIds?: string[];
}
