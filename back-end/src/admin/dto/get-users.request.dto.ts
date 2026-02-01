import { IsOptional, IsNumberString, IsBooleanString } from 'class-validator';

export class GetUsersRequestDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  isBlocked?: string;
}
