import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  maxMembers?: number;

  @IsOptional()
  @IsNumber()
  maxProjects?: number;

  @IsOptional()
  @IsArray()
  features?: string[];
}
