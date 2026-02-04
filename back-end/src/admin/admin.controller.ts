import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import type { Response } from 'express';
import { GetUsersRequestDto } from './dto/get-users.request.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users.response.dto';
import { UserStatusResponseDto } from './dto/UserStatusResponseDto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('login')
  async login(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, admin } =
      await this.adminService.login(dto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, admin };
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
  }
  @Get('users')
  async getUsers(
    @Query() query: GetUsersRequestDto,
  ): Promise<PaginatedUsersResponseDto> {
    return await this.adminService.getUsers(query);
  }
  @Patch(':id/block')
  blockUser(@Param('id') id: string): Promise<UserStatusResponseDto> {
    return this.adminService.blockUser({ userId: id });
  }
  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string): Promise<UserStatusResponseDto> {
    return this.adminService.unblockUser({ userId: id });
  }
}
