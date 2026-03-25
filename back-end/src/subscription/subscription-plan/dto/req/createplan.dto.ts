import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
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

  @IsNumber()
  durationDays: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxProjects?: number;

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
