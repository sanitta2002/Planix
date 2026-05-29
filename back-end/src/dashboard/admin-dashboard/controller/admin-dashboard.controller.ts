import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminDashboardService } from '../service/admin-dashboard.service';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Role } from '@/common/decorators/roles.decorator';
import { ApiResponse } from '@/common/utils/api-response.util';
import { DashboardMetricsDto } from '../dto/dashboard-metrics.dto';
import { SalesReportDto } from '../dto/sales-report.dto';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly _adminDashboardService: AdminDashboardService) {}

  @Get('metrics')
  @UseGuards(RolesGuard)
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  async getDashboardMetrics() {
    const data: DashboardMetricsDto =
      await this._adminDashboardService.getDashboardMetrics();
    return ApiResponse.success(
      HttpStatus.OK,
      'Dashboard metrics fetched successfully',
      data,
    );
  }

  @Get('sales-report')
  @UseGuards(RolesGuard)
  @Role('admin')
  @HttpCode(HttpStatus.OK)
  async getSalesReportData() {
    const data: SalesReportDto =
      await this._adminDashboardService.getSalesReportData();
    return ApiResponse.success(
      HttpStatus.OK,
      'Sales report data fetched successfully',
      data,
    );
  }
}
