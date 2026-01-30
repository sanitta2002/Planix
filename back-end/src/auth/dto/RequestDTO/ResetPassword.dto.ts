import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  @MinLength(8)
  @IsString()
  otp: string;
  password: string;
  @MinLength(8)
  confirmPassword: string;
}
