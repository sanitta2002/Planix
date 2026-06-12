import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IuserService } from '@/auth/interfaces/user.service.interface';
import type { IUserRepository } from '@/users/interfaces/user.repository.interface';
import { RegisterUserDto } from '@/auth/dto/RequestDTO/Register.dto';
import type { IHashingService } from '@/common/hashing/interface/hashing.service.interface';
import type { IMailService } from '@/common/mail/interfaces/mail.interface';
import type { IOtpService } from '@/common/otp/interfaces/otp.service.interface';
import { VerifyEmailDto } from '@/auth/dto/RequestDTO/verify-email.dto';
import { Resendotp } from '@/auth/dto/RequestDTO/resend-otp.dto';
import { LoginRequestDto } from '@/auth/dto/RequestDTO/Login.dto';
import type { IJwtService } from '@/common/jwt/interfaces/jwt.service.interface';
import { LoginResponseDto } from '@/auth/dto/ResponseDTO/login.res.dto';
import { ForgotPasswordDTO } from '@/auth/dto/RequestDTO/ForgotPassword.dto';
import { ResetPasswordDto } from '@/auth/dto/RequestDTO/ResetPassword.dto';
import type { ITempStoreService } from '@/common/temp-store-user/interface/temp-store.interface';
import { GoogleLoginDto } from '@/auth/dto/RequestDTO/google-login.dto';
import { OAuth2Client } from 'google-auth-library';
import { RefreshTokenResponseDto } from '@/auth/dto/ResponseDTO/RefreshTokenResponseDto';
import {
  AUTH_MESSAGES,
  OTP_MESSAGES,
  USER_MESSAGES,
} from '@/common/constants/messages.constant';
import { AuthMapper, TempUser } from '@/auth/mapper/auth.mapper';
import type { ILogger } from '@/logger/ILogger';

@Injectable()
export class AuthService implements IuserService {
  private googleClient: OAuth2Client;

  constructor(
    @Inject('ILogger')
    private readonly _logger: ILogger,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
    @Inject('IOtpService') private readonly otpService: IOtpService,
    @Inject('IMailService') private readonly mailService: IMailService,
    @Inject('IJwtService') private readonly jwtService: IJwtService,
    @Inject('ITempStoreService') private readonly tempStore: ITempStoreService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'postmessage',
    });
  }

  async registerUser(dto: RegisterUserDto): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    console.log('existing user checked', existingUser);
    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = await this.hashingService.hashPassword(dto.password);
    console.log('hashedPassword', hashedPassword);

    const tempUser = AuthMapper.toTempUser(dto, hashedPassword);
    await this.tempStore.set(`register:${dto.email}`, tempUser);

    const otp = await this.otpService.sendOtp(`otp:${dto.email}`);
    this._logger.info(`OTP generated for ${dto.email}`);
    this._logger.info(`otp ${otp}`);
    if (!otp) {
      throw new ConflictException(OTP_MESSAGES.FAILED_TO_GENERATE);
    }
    await this.mailService.sendOtpMail(dto.email, otp);
    this._logger.info(`Registration OTP sent to ${dto.email}`);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<void> {
    const { email, otp } = dto;
    await this.otpService.verifyOtp(`otp:${email}`, otp);
    this._logger.info(`${otp} verifyed`);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      await this.otpService.delete(`otp:${email}`);
      await this.tempStore.delete(`register:${email}`);
      return;
    }
    const tempUser = await this.tempStore.get<TempUser>(`register:${email}`);
    if (!tempUser) {
      throw new BadRequestException(AUTH_MESSAGES.REGISTRATION_EXPIRED);
    }
    const userEntity = AuthMapper.toUserEntity(tempUser);
    await this.userRepository.create(userEntity);

    await this.tempStore.delete(`register:${email}`);
    await this.otpService.delete(`otp:${email}`);
  }

  async ResentOtp(dto: Resendotp): Promise<void> {
    const { email } = dto;
    const tempUser = await this.tempStore.get(`register:${email}`);
    const user = await this.userRepository.findByEmail(email);
    if (!tempUser && !user) {
      throw new BadRequestException(USER_MESSAGES.NOT_FOUND);
    }
    const otp = await this.otpService.sendOtp(`otp:${email}`);
    this._logger.info(`resendOtp:, ${otp}`);
    if (!otp) {
      throw new ConflictException(OTP_MESSAGES.FAILED_TO_GENERATE);
    }
    await this.mailService.sendOtpMail(email, otp);
    this._logger.info(`OTP resent successfully  ${email}`);
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    this._logger.info('login attempted');
    const { email, password } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_EMAIL);
    }
    if (user.isBlocked) {
      throw new BadRequestException(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }
    const IsMatch = await this.hashingService.comparePassword(
      password,
      user.password,
    );
    if (!IsMatch) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_PASSWORD);
    }
    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    return AuthMapper.toLoginResponse(accessToken, refreshToken, user);
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const { email } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.EMAIL_NOT_EXIsTING);
    }
    if (!user.isEmailVerified) {
      this._logger.info(`unverified email: ${email}`);
      throw new UnauthorizedException(AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
    }
    const otp = await this.otpService.sendOtp(`otp:${email}`);
    console.log('otp', otp);
    if (!otp) {
      throw new ConflictException(OTP_MESSAGES.FAILED_TO_GENERATE);
    }
    await this.mailService.sendOtpMail(email, otp);
    this._logger.info(`Password reset OTP sent to ${email}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { email, password, confirmPassword } = dto;
    if (password !== confirmPassword) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORD_NOT_MATCH);
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_REQUEST);
    }
    const hashedPassword = await this.hashingService.hashPassword(password);
    const update = await this.userRepository.updateByEmail(email, {
      password: hashedPassword,
    });
    if (!update) {
      throw new ConflictException(AUTH_MESSAGES.PASSWORD_RESET_FAILED);
    }
    this._logger.info(`Password reset successful for ${email}`);
  }
  async googleLogin(dto: GoogleLoginDto): Promise<LoginResponseDto> {
    try {
      const token = await this.googleClient.getToken(dto.idToken);
      const idToken = token.tokens.id_token;

      if (!idToken) {
        throw new UnauthorizedException('token invalid');
      }
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
      }
      let user = await this.userRepository.findByEmail(payload.email);
      if (!user) {
        user = await this.userRepository.create({
          firstName: payload.given_name || 'User',
          lastName: payload.family_name || ' ',
          email: payload.email,
          isEmailVerified: true,
        });
      }
      const JWTpayload = {
        userId: user._id.toString(),
        email: user.email,
      };
      const accessToken = this.jwtService.signAccessToken(JWTpayload);
      const refreshToken = this.jwtService.signRefreshToken(JWTpayload);
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);
      return AuthMapper.toLoginResponse(accessToken, refreshToken, user);
    } catch (error) {
      const err = error as Error;
      this._logger.error(
        `Google Login Error: ${err?.message || String(error)}`,
        err?.stack || '',
      );
      console.error('FULL GOOGLE LOGIN ERROR:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }
  refreshToken(refreshToken: string): RefreshTokenResponseDto {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    if (!payload?.userId || !payload?.email) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }
    const accessToken = this.jwtService.signAccessToken({
      userId: payload?.userId,
      email: payload?.email,
      role: payload.role,
    });
    return AuthMapper.toRefreshTokenResponse(accessToken);
  }
}
