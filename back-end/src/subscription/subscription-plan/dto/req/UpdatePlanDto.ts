import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxMembers?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxProjects?: number;

  @IsNumber()
  durationDays: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storage?: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
