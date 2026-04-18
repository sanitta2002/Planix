import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum DateFilter {
  RECENT = 'RECENT',
  DUE_SOON = 'DUE_SOON',
}

export class GetAllIssuesFilterDTO {
  @IsString()
  projectId!: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  issueType?: string;

  @IsOptional()
  sprintId?: string | null;

  @IsOptional()
  @IsEnum(DateFilter)
  dateFilter?: DateFilter;
}
