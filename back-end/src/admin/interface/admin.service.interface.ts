import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminResponseDto } from '../dto/Admin.login.res.dto';

export interface IAdminService {
  login(dto: AdminLoginDto): Promise<AdminResponseDto>;
}
