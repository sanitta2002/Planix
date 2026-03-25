import { AdminUserResponseDto } from './admin-user.response.dto';

export class PaginatedUsersResponseDto {
  users: AdminUserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
