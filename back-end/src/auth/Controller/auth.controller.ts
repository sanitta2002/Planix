import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';
import { Resendotp } from '../dto/RequestDTO/resend-otp.dto';
import { LoginRequestDto } from '../dto/RequestDTO/Login.dto';
import { LoginResponseDto } from '../dto/ResponseDTO/login.res.dto';
import { ForgotPasswordDTO } from '../dto/RequestDTO/ForgotPassword.dto';
import { ResetPasswordDto } from '../dto/RequestDTO/ResetPassword.dto';
import { GoogleLoginDto } from '../dto/RequestDTO/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    await this.authService.registerUser(dto);
    return {
      message:
        'OTP sent to your email. please verify to complete registration.',
    };
  }
  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return await this.authService.verifyEmail(dto);
  }
  @Post('resend-otp')
  async resendOtp(@Body() dto: Resendotp) {
    await this.authService.ResentOtp(dto);
    return { message: 'OTP resent successfully' };
  }
  @Post('login')
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    await this.authService.forgotPassword(dto);
    return { message: 'password reset OTP has been sent' };
  }
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'password reset successful.' };
  }
  @Post('google')
  async googleLogin(@Body() dto: GoogleLoginDto): Promise<LoginResponseDto> {
    return this.authService.googleLogin(dto);
  }
}
