import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@/common/utils/api-response.util';
import type { ApiResponseDto } from '@/common/dto/api-response.dto';
import type { IUserDashboardService } from '@/dashboard/user-dashboard/interface/IUserDashboardService';
import { IUserDashboardResponse } from '../dto/UserDashboardResponse';

@UseGuards(JwtAuthGuard)
@Controller('user-dashboard')
export class UserDashboardController {
  constructor(
    @Inject('IUserDashboardService')
    private readonly _userDashboardService: IUserDashboardService,
  ) {}

  @Get('project/:projectId')
  async getDashboardData(
    @Param('projectId') projectId: string,
    @Req() req: { user: { userId: string } },
  ): Promise<ApiResponseDto<IUserDashboardResponse>> {
    const userId = req.user.userId;
    const data = await this._userDashboardService.getDashboardData(
      projectId,
      userId,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      'User dashboard data retrieved successfully',
      data,
    );
  }
}
