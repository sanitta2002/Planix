import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { IssueStatus } from '@/common/type/IssueStatus';
import { IssueType } from '@/common/type/IssueType';

export interface IAttachment {
  key: string;
  type: 'image' | 'document' | 'link';
  fileName?: string;
}

export class CreateIssueDTO {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(IssueType)
  issueType!: IssueType;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsOptional()
  attachments?: IAttachment[];

  @IsOptional()
  @IsString()
  parentId?: string | null;

  @IsOptional()
  @IsString()
  sprintId?: string | null;

  @IsOptional()
  @IsString()
  assigneeId?: string | null;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
