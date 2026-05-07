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
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { IIssueService } from '../interface/IIssueService';
import { CreateIssueDTO } from '../dto/req/CreateIssueDTO';
import { IssueResponse } from '../dto/res/IssueResponse';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProjectPermissionGuard } from 'src/auth/guards/project-permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import type { AuthUser } from 'src/common/decorators/getuser.decorator';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { ISSUE_SUCCESS } from 'src/common/constants/messages.constant';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { UpdateIssueDTO } from '../dto/req/UpdateIssueDTO';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddAttachmentDTO } from '../dto/req/AttachmentDTO';

@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
@Controller('issues')
export class IssueController {
  constructor(
    @Inject('IIssueService') private readonly _issueService: IIssueService,
  ) {}
  @Post()
  async createIssue(
    @Body() dto: CreateIssueDTO,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<IssueResponse>> {
    const issue = await this._issueService.createIssue(dto, user.userId);
    return ApiResponse.success(
      HttpStatus.CREATED,
      ISSUE_SUCCESS.ISSUE_CREATED,
      issue,
    );
  }
  @Get(':projectId')
  async getIssuesByProject(
    @Param('projectId') projectId: string,
  ): Promise<ApiResponseDto<IssueResponse[]>> {
    const issues = await this._issueService.getIssuesByProject(projectId);

    return ApiResponse.success(
      HttpStatus.OK,
      ISSUE_SUCCESS.ISSUES_FETCHED,
      issues,
    );
  }

  @Patch(':id')
  @Permissions('UPDATE_TASK')
  async updateIssue(
    @Param('id') id: string,
    @Body() dto: UpdateIssueDTO,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<IssueResponse>> {
    const issue = await this._issueService.updateIssue(id, dto, user.userId);

    return ApiResponse.success(
      HttpStatus.OK,
      ISSUE_SUCCESS.ISSUE_UPDATED,
      issue,
    );
  }
  @Post(':issueId/attachments')
  @UseInterceptors(FilesInterceptor('files'))
  async addAttachments(
    @Param('issueId') issueId: string,
    @Body() dto: AddAttachmentDTO,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<IssueResponse>> {
    const issue = await this._issueService.addAttachments(
      issueId,
      dto,
      user.userId,
      files,
    );

    return ApiResponse.success(
      HttpStatus.OK,
      ISSUE_SUCCESS.ISSUE_UPDATED,
      issue,
    );
  }
  @Delete(':issueId/attachments')
  async deleteAttachment(
    @Param('issueId') issueId: string,
    @Query('key') key: string,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<IssueResponse>> {
    const issue = await this._issueService.deleteAttachment(
      issueId,
      key,
      user.userId,
    );

    return ApiResponse.success(
      HttpStatus.OK,
      ISSUE_SUCCESS.ISSUE_DELETED,
      issue,
    );
  }
  @Get(':issueId/attachments/url')
  async getAttachmentUrl(
    @Param('issueId') issueId: string,
    @Query('key') key: string,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<{ url: string }>> {
    const result = await this._issueService.getAttachmentUrl(
      issueId,
      key,
      user.userId,
    );

    return ApiResponse.success(HttpStatus.OK, 'Attachment URL fetched', result);
  }
}
