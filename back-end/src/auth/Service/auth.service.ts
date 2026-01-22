import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { IuserService } from '../interfaces/user.service.interface';
import type { IUserRepository } from 'src/users/interfaces/user.repository.interface';
import { User } from 'src/users/Models/user.schema';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import type { IHashingService } from 'src/common/hashing/interface/hashing.service.interface';
import type { IMailService } from 'src/common/mail/interfaces/mail.interface';
import type{ IOtpService } from 'src/common/otp/interfaces/otp.service.interface';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';
import { Resendotp } from '../dto/RequestDTO/resend-otp.dto';


@Injectable()
export class AuthService implements IuserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
    @Inject('IOtpService') private readonly otpService: IOtpService,
    @Inject('IMailService') private readonly mailService: IMailService,
  ) {}
  async registerUser(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await this.hashingService.hashPassword(dto.password);
    console.log('hashedPassword',hashedPassword)
    const otp= await this.otpService.sendOtp(`otp:${dto.email}`);
    if(!otp){
      throw new ConflictException('failed to generate OTP')
    }
    await this.mailService.sendOtpMail(dto.email, otp);
    console.log('OTP generated', otp);
    return this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });
  }
  async verifyEmail(dto: VerifyEmailDto): Promise<void> {
 
     const {email,otp}=dto
    await this.otpService.verifyOtp(`otp:${email}`,otp)
    const user= await this.userRepository.findByEmail(email)
    if(!user){
      throw new BadRequestException('user not found')
    }
    await this.userRepository.updateByEmail(email,{
      isEmailVerified:true
    })
  }
  async ResentOtp(dto: Resendotp): Promise<void> {
    const {email} = dto
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw new BadRequestException('user not found')
    }
    if(user.isEmailVerified){
      throw new BadRequestException('email already verified')
    }
    const otp = await this.otpService.sendOtp(`otp:${email}`)
    console.log('resendOtp:', otp)
    if(!otp){
      throw new ConflictException('failed to generate OTP')
    }
    await this.mailService.sendOtpMail(email,otp)
  }
}
