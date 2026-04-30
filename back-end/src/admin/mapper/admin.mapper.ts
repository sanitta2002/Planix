import { PaginatedUsersResponseDto } from '../dto/paginated-users.response.dto';
import { UserStatusResponseDto } from '../dto/UserStatusResponseDto';
import { AdminResponseDto } from '../dto/Admin.login.res.dto';
import { User, UserDocument } from 'src/users/Models/user.schema';
import { PaginatedWorkspaceResponseDto } from '../dto/PaginatedWorkspaceResponseDto ';
import { WorkspaceDocument } from 'src/workspace/Model/workspace.schema';

type Owner = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

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
  static toPaginatedWorkspacesResponse(
    workspacesWithLogo: { workspace: WorkspaceDocument }[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedWorkspaceResponseDto {
    return {
      data: workspacesWithLogo.map(({ workspace }) => {
        const owner = workspace.ownerId as unknown as Owner;

        return {
          id: workspace._id.toString(),
          name: workspace.name,
          description: workspace.description,

          ownerId: {
            id: owner._id.toString(),
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
          },

          members: workspace.members?.map((m) => m.user.toString()) || [],
          subscriptionId: workspace.subscriptionId?.toString(),
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
          subscriptionStatus: workspace.subscriptionStatus,
        };
      }),

      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
