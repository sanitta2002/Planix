import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminResponseDto } from '../dto/Admin.login.res.dto';
import { BlockUserDto } from '../dto/block-user.dto';
import { GetUsersRequestDto } from '../dto/get-users.request.dto';
import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';
import { UserStatusResponseDto } from '../dto/UserStatusResponseDto';

export interface IAdminService {
  login(dto: AdminLoginDto): Promise<AdminResponseDto>;
  getUsers(query: GetUsersRequestDto): Promise<PaginatedUsersResponseDto>;
  blockUser(dto: BlockUserDto): Promise<UserStatusResponseDto>;
  unblockUser(dto: BlockUserDto): Promise<UserStatusResponseDto>;
}
