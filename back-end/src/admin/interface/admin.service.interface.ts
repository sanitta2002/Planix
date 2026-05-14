import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminResponseDto } from '../dto/Admin.login.res.dto';
import { BlockUserDto } from '../dto/block-user.dto';
import { GetUsersRequestDto } from '../dto/get-users.request.dto';
import { GetWorkspacesRequestDto } from '../dto/GetWorkspacesRequestDto ';
import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';
import { PaginatedWorkspaceResponseDto } from '../dto/PaginatedWorkspaceResponseDto ';
import { UserStatusResponseDto } from '../dto/UserStatusResponseDto';
import { GetPaymentsRequestDto } from '../dto/get-payments-request.dto';

import { PaginatedPaymentsResponseDto } from '../dto/paginated-payments.response.dto';

export interface IAdminService {
  login(dto: AdminLoginDto): AdminResponseDto;
  getUsers(query: GetUsersRequestDto): Promise<PaginatedUsersResponseDto>;
  blockUser(dto: BlockUserDto): Promise<UserStatusResponseDto>;
  unblockUser(dto: BlockUserDto): Promise<UserStatusResponseDto>;
  getAllWorkspaces(
    query: GetWorkspacesRequestDto,
  ): Promise<PaginatedWorkspaceResponseDto>;
  getAllPayments(
    query: GetPaymentsRequestDto,
  ): Promise<PaginatedPaymentsResponseDto>;
}
