import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IuserService } from '../interfaces/user.service.interface';
import type { IUserRepository } from 'src/users/interfaces/user.repository.interface';
import { User } from 'src/users/Models/user.schema';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import type { IHashingService } from 'src/common/hashing/interface/hashing.service.interface';
import type { IMailService } from 'src/common/mail/interfaces/mail.interface';
import type { IOtpService } from 'src/common/otp/interfaces/otp.service.interface';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';
import { Resendotp } from '../dto/RequestDTO/resend-otp.dto';
import { LoginRequestDto } from '../dto/RequestDTO/Login.dto';
import type { IJwtService } from 'src/common/jwt/interfaces/jwt.service.interface';
import { LoginResponseDto } from '../dto/ResponseDTO/login.res.dto';
import { ForgotPasswordDTO } from '../dto/RequestDTO/ForgotPassword.dto';
import { ResetPasswordDto } from '../dto/RequestDTO/ResetPassword.dto';

@Injectable()
export class AuthService implements IuserService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
    @Inject('IOtpService') private readonly otpService: IOtpService,
    @Inject('IMailService') private readonly mailService: IMailService,
    @Inject('IJwtService') private readonly jwtService: IJwtService,
  ) {}
  async registerUser(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await this.hashingService.hashPassword(dto.password);
    console.log('hashedPassword', hashedPassword);
    const otp = await this.otpService.sendOtp(`otp:${dto.email}`);
    this.logger.log(`OTP generated for ${dto.email}`);
    if (!otp) {
      throw new ConflictException('failed to generate OTP');
    }
    await this.mailService.sendOtpMail(dto.email, otp);

    return this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<void> {
    const { email, otp } = dto;
    await this.otpService.verifyOtp(`otp:${email}`, otp);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    await this.userRepository.updateByEmail(email, {
      isEmailVerified: true,
    });
  }

  async ResentOtp(dto: Resendotp): Promise<void> {
    const { email } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('email already verified');
    }
    const otp = await this.otpService.sendOtp(`otp:${email}`);
    this.logger.log('resendOtp:', otp);
    if (!otp) {
      throw new ConflictException('failed to generate OTP');
    }
    await this.mailService.sendOtpMail(email, otp);
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('invalid email');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('please verify your email');
    }
    const IsMatch = await this.hashingService.comparePassword(
      password,
      user.password,
    );
    if (!IsMatch) {
      throw new UnauthorizedException('invalid password');
    }
    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    return { accessToken, refreshToken };
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const { email } = dto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('invalid email');
    }
    if (!user.isEmailVerified) {
      this.logger.warn(`unverified email: ${email}`);
      throw new UnauthorizedException('please verify your email');
    }
    const otp = await this.otpService.sendOtp(`otp:${email}`);
    console.log("otp",otp)
    if (!otp) {
      throw new ConflictException('failed to generate OTP');
    }
    await this.mailService.sendOtpMail(email, otp);
    this.logger.log(`Password reset OTP sent to ${email}`);
  }

  async resetPassword(dto:ResetPasswordDto ): Promise<void> {
    const {email,password,confirmPassword}=dto
    if(password!==confirmPassword){
      throw new BadRequestException('password do not match');
    }
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw new BadRequestException('invalid request');
    }
    const hashedPassword = await this.hashingService.hashPassword(password)
    const update = await this.userRepository.updateByEmail(email,{
      password: hashedPassword,
    })
    if(!update){
       throw new ConflictException('failed to reset password');
    }
    this.logger.log(`Password reset successful for ${email}`);
  }
}
