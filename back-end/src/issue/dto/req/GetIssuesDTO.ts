import { IsOptional, IsString } from 'class-validator';

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
}
