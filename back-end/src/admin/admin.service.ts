import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAdminService } from './interface/admin.service.interface';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminResponseDto } from './dto/Admin.login.res.dto';
import type { IJwtService } from 'src/common/jwt/interfaces/jwt.service.interface';
import { UserRepository } from 'src/users/repository/user.Repository';
import { GetUsersRequestDto } from './dto/get-users.request.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users.response.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { UserStatusResponseDto } from './dto/UserStatusResponseDto';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @Inject('IJwtService') private readonly jwtService: IJwtService,
    @Inject('IUserRepository') private readonly userRepository: UserRepository,
  ) {}
  async login(dto: AdminLoginDto): Promise<AdminResponseDto> {
    const { email, password } = dto;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    const payload = {
      userId: 'ADMIN',
      email: process.env.ADMIN_EMAIL,
      role: 'admin',
    };
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
      admin: { id: 'ADMIN', email: process.env.ADMIN_EMAIL },
    };
  }
  async getUsers(
    query: GetUsersRequestDto,
  ): Promise<PaginatedUsersResponseDto> {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const isBlocked =
      query.isBlocked !== undefined ? query.isBlocked === 'true' : undefined;
    const { users, total } = await this.userRepository.findUsersWithPagination(
      page,
      limit,
      query.search,
      isBlocked,
    );
    return {
      users: users.map((user) => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
        isEmailVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      })),
      total,
      page,
      limit,
    };
  }
  async blockUser(dto: BlockUserDto): Promise<UserStatusResponseDto> {
    const { userId } = dto;
    const user = await this.userRepository.blockUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user._id.toString(),
      isBlocked: user.isBlocked,
    };
  }
  async unblockUser(dto: BlockUserDto): Promise<UserStatusResponseDto> {
    const { userId } = dto;
    const user = await this.userRepository.unblockUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { id: user._id.toString(), isBlocked: user.isBlocked };
  }
}
