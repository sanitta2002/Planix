import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetAllProjectsDTO {
  @IsOptional()
  @IsString()
  workspaceId: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
