import { IsOptional, IsString } from 'class-validator';

export class GetPaymentsRequestDto {
  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
