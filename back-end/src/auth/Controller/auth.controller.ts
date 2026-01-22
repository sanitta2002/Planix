import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';
import { Resendotp } from '../dto/RequestDTO/resend-otp.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto): Promise<RegisterUserDto> {
    return this.authService.registerUser(dto);
  }
  @Post('verify-email')
  async verifyEmail(@Body() dto:VerifyEmailDto){
    return await this.authService.verifyEmail(dto)
    
    
  }
  @Post('resend-otp')
  async resendOtp(@Body() dto:Resendotp){
    await this.authService.ResentOtp(dto)
    return {message:'OTP resent successfully'}
  }
}
