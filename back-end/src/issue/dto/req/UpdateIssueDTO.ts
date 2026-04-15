import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { IssueType } from 'src/common/type/IssueType';
import { IssueStatus } from 'src/common/type/IssueStatus';

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
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  attachments?: {
    type: string;
    url: string;
    fileName?: string;
  }[];
}
