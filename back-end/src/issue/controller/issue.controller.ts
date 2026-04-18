import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { IIssueService } from '../interface/IIssueService';
import { CreateIssueDTO } from '../dto/req/CreateIssueDTO';
import { IssueResponse } from '../dto/res/IssueResponse';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import type { AuthUser } from 'src/common/decorators/getuser.decorator';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { ISSUE_SUCCESS } from 'src/common/constants/messages.constant';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { UpdateIssueDTO } from '../dto/req/UpdateIssueDTO';

@UseGuards(JwtAuthGuard)
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
}
