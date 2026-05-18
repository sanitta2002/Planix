import { RegisterUserDto } from '@/auth/dto/RequestDTO/Register.dto';
import { VerifyEmailDto } from '@/auth/dto/RequestDTO/verify-email.dto';
import { Resendotp } from '@/auth/dto/RequestDTO/resend-otp.dto';
import { LoginRequestDto } from '@/auth/dto/RequestDTO/Login.dto';
import { LoginResponseDto } from '@/auth/dto/ResponseDTO/login.res.dto';
import { ForgotPasswordDTO } from '@/auth/dto/RequestDTO/ForgotPassword.dto';
import { ResetPasswordDto } from '@/auth/dto/RequestDTO/ResetPassword.dto';
import { GoogleLoginDto } from '@/auth/dto/RequestDTO/google-login.dto';
import { RefreshTokenResponseDto } from '@/auth/dto/ResponseDTO/RefreshTokenResponseDto';

export interface IuserService {
  registerUser(dto: RegisterUserDto): Promise<void>;
  verifyEmail(dto: VerifyEmailDto): Promise<void>;
  ResentOtp(dto: Resendotp): Promise<void>;
  login(dto: LoginRequestDto): Promise<LoginResponseDto>;
  forgotPassword(dto: ForgotPasswordDTO): Promise<void>;
  resetPassword(dto: ResetPasswordDto): Promise<void>;
  googleLogin(dto: GoogleLoginDto): Promise<LoginResponseDto>;
  refreshToken(refreshToken: string): RefreshTokenResponseDto;
}
