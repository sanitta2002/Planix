import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminLoginDto } from './dto/admin-login.dto';
import type { Response } from 'express';
import { GetUsersRequestDto } from './dto/get-users.request.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users.response.dto';
import { UserStatusResponseDto } from './dto/UserStatusResponseDto';
import type { IAdminService } from './interface/admin.service.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { ConfigService } from '@nestjs/config';
import {
  ADMIN_MESSAGES,
  USER_MESSAGES,
} from 'src/common/constants/messages.constant';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject('IAdminService') private readonly adminService: IAdminService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AdminLoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, admin } = this.adminService.login(dto);
    const maxAge = Number(this.configService.get<string>('Max_Age'));
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge,
    });
    return ApiResponse.success(HttpStatus.OK, ADMIN_MESSAGES.LOGIN_SUCCESS, {
      accessToken,
      admin,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    return ApiResponse.success(HttpStatus.OK, ADMIN_MESSAGES.LOGOUT_SUCCESS);
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() query: GetUsersRequestDto,
  ): Promise<PaginatedUsersResponseDto> {
    return await this.adminService.getUsers(query);
  }

  @Patch(':id/block')
  @UseGuards(RolesGuard)
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  async blockUser(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<UserStatusResponseDto>> {
    const result = await this.adminService.blockUser({ userId: id });
    return ApiResponse.success(HttpStatus.OK, USER_MESSAGES.BLOCKED, result);
  }

  @Patch(':id/unblock')
  @UseGuards(RolesGuard)
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  async unblockUser(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<UserStatusResponseDto>> {
    const result = await this.adminService.unblockUser({ userId: id });
    return ApiResponse.success(HttpStatus.OK, USER_MESSAGES.UNBLOCKED, result);
  }
}
