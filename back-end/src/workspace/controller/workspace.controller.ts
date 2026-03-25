import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { IWorkspaceService } from '../interface/IWorkspaceService';
import { Request } from 'express';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { WORKSPACE_MESSAGE } from 'src/common/constants/messages.constant';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WorkspaceMembersResponseDto } from '../dto/res/WorkspaceMembersResponseDto';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { UpdateWorkspaceDto } from '../dto/req/UpdateWorkspaceDto';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @Get(':workspaceId/members')
  async getWorkspaceMembers(
    @Param('workspaceId') workspaceId: string,
  ): Promise<ApiResponseDto<WorkspaceMembersResponseDto>> {
    const members =
      await this._workspaceService.getWorkspaceMembers(workspaceId);
    return ApiResponse.success(
      HttpStatus.OK,
      WORKSPACE_MESSAGE.MEMBERS,
      members,
    );
  }
  @Delete(':workspaceId/members/:memberId')
  async removeMember(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ) {
    await this._workspaceService.removeMember(workspaceId, memberId);
    return ApiResponse.success(HttpStatus.OK, WORKSPACE_MESSAGE.MEMBER_DELETED);
  }
  @Patch(':workspaceId')
  async updateWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: UpdateWorkspaceDto,
    @Req() req: AuthRequest,
  ) {
    const updatedWorkspace = await this._workspaceService.updateWorkspace(
      workspaceId,
      req.user.userId,
      dto,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      WORKSPACE_MESSAGE.UPDATED,
      updatedWorkspace,
    );
  }
  @Patch(':workspaceId/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadWorkspaceLogo(
    @Param('workspaceId') workspaceId: string,
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const logoResponse = await this._workspaceService.uploadWorkspaceLogo(
      workspaceId,
      req.user.userId,
      file,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      WORKSPACE_MESSAGE.LOGO_UPDATED,
      logoResponse,
    );
  }
  @Get(':workspaceId')
  async getWorkspaceProfile(@Param('workspaceId') workspaceId: string) {
    const workspace =
      await this._workspaceService.getWorkspaceProfile(workspaceId);

    return ApiResponse.success(
      HttpStatus.OK,
      WORKSPACE_MESSAGE.FETCHED,
      workspace,
    );
  }
  @Get(':workspaceId/payment')
  async getWorkspacePaymentDetails(
    @Param('workspaceId') workspaceId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.userId;
    const details = await this._workspaceService.getWorkspacePaymentDetails(
      workspaceId,
      userId,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      WORKSPACE_MESSAGE.FETCHED,
      details,
    );
  }
}
