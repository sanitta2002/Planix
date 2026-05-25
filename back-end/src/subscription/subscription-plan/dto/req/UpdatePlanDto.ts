import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxMembers?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxProjects?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storage?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
