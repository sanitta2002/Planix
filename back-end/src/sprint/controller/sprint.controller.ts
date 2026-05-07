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

import { CreateSprintDto } from '../dto/req/CreateSprintDto';
import { GetUser } from 'src/common/decorators/getuser.decorator';
import type { AuthUser } from 'src/common/decorators/getuser.decorator';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { SprintResponse } from '../dto/res/SprintResponse';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { SPRINT_MESSAGES } from 'src/common/constants/messages.constant';
import type { ISprintservice } from '../interface/IsprintSerivce';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProjectPermissionGuard } from 'src/auth/guards/project-permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UpdateSprintDto } from '../dto/req/UpdateSprintDto ';
@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
@Controller('sprint')
export class SprintController {
  constructor(
    @Inject('Isprintservice') private readonly _sprintService: ISprintservice,
  ) {}
  @Post()
  @Permissions('CREATE_SPRINT')
  async createSprint(
    @Body() dto: CreateSprintDto,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<SprintResponse>> {
    const sprint = await this._sprintService.createSprint(dto, user.userId);

    return ApiResponse.success(
      HttpStatus.CREATED,
      SPRINT_MESSAGES.CREATED,
      sprint,
    );
  }
  @Get('project/:projectId')
  async getSprintsByProject(
    @Param('projectId') projectId: string,
  ): Promise<ApiResponseDto<SprintResponse[]>> {
    const sprints = await this._sprintService.getSprintsByProject(projectId);

    return ApiResponse.success(HttpStatus.OK, SPRINT_MESSAGES.FETCHED, sprints);
  }
  @Patch(':sprintId/start')
  async startSprint(
    @Param('sprintId') sprintId: string,
    @Body() dto: UpdateSprintDto,
  ): Promise<ApiResponseDto<SprintResponse>> {
    const sprint = await this._sprintService.startSprint(dto, sprintId);

    return ApiResponse.success(HttpStatus.OK, SPRINT_MESSAGES.STARTED, sprint);
  }

  @Patch(':sprintId/complete')
  @Permissions('COMPLETE_SPRINT')
  async completeSprint(
    @Param('sprintId') sprintId: string,
    @Body() dto: UpdateSprintDto,
  ): Promise<ApiResponseDto<SprintResponse>> {
    const sprint = await this._sprintService.completeSprint(dto, sprintId);

    return ApiResponse.success(HttpStatus.OK, SPRINT_MESSAGES.UPDATED, sprint);
  }
}
