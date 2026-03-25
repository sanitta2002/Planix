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
  PAYMENT_MESSAGE,
  USER_MESSAGES,
} from 'src/common/constants/messages.constant';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { GetWorkspacesRequestDto } from './dto/GetWorkspacesRequestDto ';
import { PaginatedWorkspaceResponseDto } from './dto/PaginatedWorkspaceResponseDto ';
import type { ISubscriptionService } from 'src/subscription/interface/ISubscriptionService';
import type { IPaymentService } from 'src/payment/interface/IPaymentService';
import { generateInvoiceHTML } from 'src/common/utils/pdf.util';
import puppeteer from 'puppeteer';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject('IAdminService') private readonly adminService: IAdminService,
    @Inject('ISubscriptionService')
    private readonly _subscriptionService: ISubscriptionService,
    @Inject('IPaymentService')
    private readonly _paymentService: IPaymentService,
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
  @Get('workspaces')
  @UseGuards(RolesGuard)
  @Role('admin')
  async getWorkspaces(
    @Query() query: GetWorkspacesRequestDto,
  ): Promise<PaginatedWorkspaceResponseDto> {
    return await this.adminService.getAllWorkspaces(query);
  }
  @Get('paymets')
  async getAllPayments() {
    const data = await this._paymentService.getAllPayments();
    return ApiResponse.success(
      HttpStatus.OK,
      PAYMENT_MESSAGE.PAYMENT_FETCH,
      data,
    );
  }
  @Get('report')
  async downloadReport(@Res() res: Response) {
    const payments = await this._paymentService.getAllPayments();

    const html = generateInvoiceHTML(payments);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    res.send(pdfBuffer);
  }
}
