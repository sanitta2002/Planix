import { User } from 'src/users/Models/user.schema';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import { VerifyEmailDto } from '../dto/RequestDTO/verify-email.dto';

export interface IuserService {
  registerUser(dto: RegisterUserDto): Promise<User>;
  verifyEmail(dto:VerifyEmailDto):Promise<void>;
}
