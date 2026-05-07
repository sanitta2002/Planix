import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateSprintDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsOptional()
  workspaceId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
