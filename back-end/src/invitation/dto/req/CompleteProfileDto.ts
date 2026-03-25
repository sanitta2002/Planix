import { IsString, MinLength } from 'class-validator';

export class CompleteProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
