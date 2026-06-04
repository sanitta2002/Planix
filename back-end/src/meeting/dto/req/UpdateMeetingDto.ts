import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { MeetingStatus } from '@/common/type/MeetingStatus';
import { MeetingType } from '@/common/type/MeetingType';

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;

  @IsOptional()
  @IsEnum(MeetingType)
  meetingType?: MeetingType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  attendeeIds?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
