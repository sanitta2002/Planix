import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsIn,
} from 'class-validator';
import { IssueType } from '@/common/type/IssueType';
import { IssueStatus } from '@/common/type/IssueStatus';

export class UpdateIssueDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @IsOptional()
  @IsEnum(IssueType)
  issueType?: IssueType;

  @IsOptional()
  parentId?: string;

  @IsOptional()
  sprintId?: string;

  @IsOptional()
  assigneeId?: string;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2, 3, 5, 8, 13])
  storyPoints?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  attachments?: {
    type: string;
    key: string;
    fileName?: string;
  }[];
}
