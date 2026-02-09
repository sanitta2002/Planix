import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';
import { UserStatusResponseDto } from '../dto/UserStatusResponseDto';
import { AdminResponseDto } from '../dto/Admin.login.res.dto';
import { User, UserDocument } from 'src/users/Models/user.schema';

export class AdminMapper {
  static toAdminLoginResponse(
    accessToken: string,
    refreshToken: string,
    email: string,
  ): AdminResponseDto {
    return {
      accessToken,
      refreshToken,
      admin: {
        id: 'ADMIN',
        email,
      },
    };
  }

  static toPaginatedUsersResponse(
    usersWithAvatar: { user: User; avatarUrl: string | null }[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedUsersResponseDto {
    return {
      users: usersWithAvatar.map(({ user, avatarUrl }) => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: avatarUrl ?? undefined,
      })),
      total,
      page,
      limit,
    };
  }

  static toUserStatusResponse(user: UserDocument): UserStatusResponseDto {
    return {
      id: user._id.toString(),
      isBlocked: user.isBlocked,
    };
  }
}
