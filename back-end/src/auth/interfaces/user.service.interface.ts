import { User } from 'src/users/Models/user.schema';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';
import { Resendotp } from '../dto/RequestDTO/resend-otp.dto';
import { LoginRequestDto } from '../dto/RequestDTO/Login.dto';
import { LoginResponseDto } from '../dto/ResponseDTO/login.res.dto';


export interface IuserService {
  registerUser(dto: RegisterUserDto): Promise<User>;
  verifyEmail(dto:VerifyEmailDto):Promise<void>;
  ResentOtp(dto:Resendotp):Promise<void>
  login(dto:LoginRequestDto):Promise<LoginResponseDto>
}
