import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IWorkspaceService } from '../interface/IWorkspaceService';
import { Request } from 'express';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { WORKSPACE_MESSAGE } from 'src/common/constants/messages.constant';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
interface AuthRequest extends Request {
  user: { userId: string };
}

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    @Inject('IWorkspaceService')
    private readonly _workspaceService: IWorkspaceService,
  ) {}
  @Post('workspace')
  async createWorkspace(
    @Req() req: AuthRequest,
    @Body() dto: CreateWorkspaceDto,
  ) {
    const createdWorkspace = await this._workspaceService.createWorkspace(
      req.user.userId,
      dto,
    );
    return ApiResponse.success(
      HttpStatus.CREATED,
      WORKSPACE_MESSAGE.CREATED,
      createdWorkspace,
    );
  }
  @Get('workspace')
  async getUserWorkspaces(@Req() req: AuthRequest) {
    const userWorkspaces = await this._workspaceService.getUserWorkspaces(
      req.user.userId,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      WORKSPACE_MESSAGE.FETCHED,
      userWorkspaces,
    );
  }
}
