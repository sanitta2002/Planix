import { AdminLoginDto } from '@/admin/dto/admin-login.dto';
import { AdminResponseDto } from '@/admin/dto/Admin.login.res.dto';
import { BlockUserDto } from '@/admin/dto/block-user.dto';
import { GetUsersRequestDto } from '@/admin/dto/get-users.request.dto';
import { GetWorkspacesRequestDto } from '@/admin/dto/GetWorkspacesRequestDto ';
import { PaginatedUsersResponseDto } from '@/admin/dto/paginated-users.response.dto';
import { PaginatedWorkspaceResponseDto } from '@/admin/dto/PaginatedWorkspaceResponseDto ';
import { UserStatusResponseDto } from '@/admin/dto/UserStatusResponseDto';
import { GetPaymentsRequestDto } from '@/admin/dto/get-payments-request.dto';

import { PaginatedPaymentsResponseDto } from '@/admin/dto/paginated-payments.response.dto';

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
