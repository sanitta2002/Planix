import {
  Inject,
  Injectable,
  Logger,
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
import {
  ADMIN_MESSAGES,
  OTP_MESSAGES,
} from 'src/common/constants/messages.constant';
import { AdminMapper } from './mapper/admin.mapper';
import type { IS3Service } from 'src/common/s3/interfaces/s3.service.interface';
import type { IWorkspaceRepository } from 'src/workspace/interface/IWorkspaceRepository';
import { PaginatedWorkspaceResponseDto } from './dto/PaginatedWorkspaceResponseDto ';
import { GetWorkspacesRequestDto } from './dto/GetWorkspacesRequestDto ';
import { GetPaymentsRequestDto } from './dto/get-payments-request.dto';
import { PaginatedPaymentsResponseDto } from './dto/paginated-payments.response.dto';
import type { IPaymentService } from 'src/payment/interface/IPaymentService';
import { PaymentDto } from 'src/payment/dto/PaymentDto';

@Injectable()
export class AdminService implements IAdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @Inject('IJwtService') private readonly jwtService: IJwtService,
    @Inject('IUserRepository') private readonly userRepository: UserRepository,
    @Inject('IS3Service') private readonly s3Service: IS3Service,
    @Inject('IWorkspaceRepository')
    private readonly _workspaceRepository: IWorkspaceRepository,
    @Inject('IPaymentService')
    private readonly _paymentService: IPaymentService,
  ) {}
  login(dto: AdminLoginDto): AdminResponseDto {
    this.logger.log(`admin login attempt: ${dto.email}`);
    const { email, password } = dto;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      this.logger.warn(`invalid admin login: ${email}`);
      throw new UnauthorizedException(ADMIN_MESSAGES.INVALID_CREDENTIALS);
    }
    const payload = {
      userId: 'ADMIN',
      email: process.env.ADMIN_EMAIL,
      role: 'admin',
    };
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    this.logger.log(`admin login successful: ${email}`);
    return AdminMapper.toAdminLoginResponse(
      accessToken,
      refreshToken,
      process.env.ADMIN_EMAIL,
    );
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
    const usersWithAvatar = await Promise.all(
      users.map(async (user) => {
        const avatarUrl = user.avatarKey
          ? await this.s3Service.createSignedUrl(user.avatarKey)
          : null;

        return {
          user,
          avatarUrl,
        };
      }),
    );
    return AdminMapper.toPaginatedUsersResponse(
      usersWithAvatar,
      total,
      page,
      limit,
    );
  }
  async blockUser(dto: BlockUserDto): Promise<UserStatusResponseDto> {
    this.logger.log(`block user: ${dto.userId}`);
    const { userId } = dto;
    const user = await this.userRepository.blockUser(userId);
    if (!user) {
      this.logger.warn(`block failed:${userId}`);
      throw new NotFoundException(OTP_MESSAGES.USER_NOT_FOUND);
    }
    this.logger.log(`user blocked successfully: ${userId}`);
    return { id: user._id.toString(), isBlocked: user.isBlocked };
  }
  async unblockUser(dto: BlockUserDto): Promise<UserStatusResponseDto> {
    this.logger.log(`unblock user: ${dto.userId}`);
    const { userId } = dto;
    const user = await this.userRepository.unblockUser(userId);
    if (!user) {
      throw new NotFoundException(OTP_MESSAGES.USER_NOT_FOUND);
    }
    this.logger.log(`user unblocked successfully: ${userId}`);
    return { id: user._id.toString(), isBlocked: user.isBlocked };
  }
  async getAllWorkspaces(
    query: GetWorkspacesRequestDto,
  ): Promise<PaginatedWorkspaceResponseDto> {
    this.logger.log('admin fetch all warkspace');
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const { workspaces, total } =
      await this._workspaceRepository.findAllWorkspace(page, limit);
    const workspacesWithLogo = await Promise.all(
      workspaces.map(async (workspace) => {
        const logoUrl = workspace.logo
          ? await this.s3Service.createSignedUrl(workspace.logo)
          : null;

        return {
          workspace,
          logoUrl,
        };
      }),
    );

    return AdminMapper.toPaginatedWorkspacesResponse(
      workspacesWithLogo,
      total,
      page,
      limit,
    );
  }
  async getAllPayments(
    query: GetPaymentsRequestDto,
  ): Promise<PaginatedPaymentsResponseDto> {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    const { payments, total }: { payments: PaymentDto[]; total: number } =
      await this._paymentService.getAllPayments(
        query.planId,
        query.startDate,
        query.endDate,
        query.status,
        page,
        limit,
      );

    return {
      data: payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
