import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@/common/utils/api-response.util';
import { UserDashboardService } from '../service/user-dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('user-dashboard')
export class UserDashboardController {
  constructor(private readonly _userDashboardService: UserDashboardService) {}

  @Get('project/:projectId')
  async getDashboardData(
    @Param('projectId') projectId: string,
    @Req() req: { user: { userId: string } },
  ) {
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
