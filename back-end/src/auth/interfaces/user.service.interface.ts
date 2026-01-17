import { User } from 'src/users/Models/user.schema';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';

export interface IuserService {
  registerUser(dto: RegisterUserDto): Promise<User>;
}
