import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';
import { Resendotp } from '../dto/RequestDTO/resend-otp.dto';
import { LoginRequestDto } from '../dto/RequestDTO/Login.dto';
import { ForgotPasswordDTO } from '../dto/RequestDTO/ForgotPassword.dto';
import { ResetPasswordDto } from '../dto/RequestDTO/ResetPassword.dto';
import { GoogleLoginDto } from '../dto/RequestDTO/google-login.dto';
import type { Request, Response } from 'express';
import type { IuserService } from '../interfaces/user.service.interface';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from 'src/common/utils/api-response.util';
import {
  AUTH_MESSAGES,
  OTP_MESSAGES,
  USER_MESSAGES,
} from 'src/common/constants/messages.constant';

interface RefreshTokenCookies {
  refreshToken?: string;
}
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IuserService') private readonly authService: IuserService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    await this.authService.registerUser(dto);
    return ApiResponse.success(
      HttpStatus.CREATED,
      AUTH_MESSAGES.REGISTER_SUCCESS,
    );
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const user = await this.authService.verifyEmail(dto);
    return ApiResponse.success(
      HttpStatus.OK,
      AUTH_MESSAGES.EMAIL_VERIFIED,
      user,
    );
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: Resendotp) {
    await this.authService.ResentOtp(dto);
    return ApiResponse.success(HttpStatus.OK, OTP_MESSAGES.SENT);
  }

  @Post('login')
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);
    const maxAge = Number(this.configService.get<string>('Max_Age'));
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge,
    });
    return ApiResponse.success(HttpStatus.OK, AUTH_MESSAGES.LOGIN_SUCCESS, {
      accessToken,
      user,
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDTO) {
    await this.authService.forgotPassword(dto);
    return ApiResponse.success(HttpStatus.OK, OTP_MESSAGES.RESENT);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return ApiResponse.success(HttpStatus.OK, USER_MESSAGES.PASSWORD_CHANGED);
  }

  @Post('google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(dto);
    const maxAge = Number(this.configService.get<string>('Max_Age'));
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge,
    });
    return ApiResponse.success(
      HttpStatus.OK,
      AUTH_MESSAGES.GOOGLE_LOGIN_SUCCESS,
      {
        accessToken,
        user,
      },
    );
  }

  @Post('refresh')
  refresh(@Req() req: Request) {
    const cookies = req.cookies as RefreshTokenCookies;
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(
        ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Refresh token not found'),
      );
    }
    const tokens = this.authService.refreshToken(refreshToken);
    console.log(tokens);
    return ApiResponse.success(
      HttpStatus.OK,
      AUTH_MESSAGES.TOKEN_REFRESHED,
      tokens,
    );
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return ApiResponse.success(HttpStatus.OK, AUTH_MESSAGES.LOGOUT_SUCCESS);
  }
}
