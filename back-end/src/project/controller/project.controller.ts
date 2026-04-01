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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IProjectService } from '../interfaces/IProjectService';
import { CreateProjectDto } from '../dto/req/CreateProjectDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { PROJECT } from 'src/common/constants/messages.constant';
import { UpdateProjectDto } from '../dto/req/UpdateProjectDto';
import { GetAllProjectsDTO } from '../dto/req/GetAllProjectsDTO';

interface AuthRequest extends Request {
  user: { userId: string };
}

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    @Inject('IProjectService')
    private readonly _projectService: IProjectService,
  ) {}
  @Post(':workspaceId')
  async createProject(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateProjectDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.userId;
    const project = await this._projectService.createProject(
      dto,
      workspaceId,
      userId,
    );
    return ApiResponse.success(
      HttpStatus.CREATED,
      PROJECT.PROJECT_CREATED_SUCCESSFULLY,
      project,
    );
  }
  @Get(':workspaceId/projects')
  async getAllProjects(
    @Param('workspaceId') workspaceId: string,
    @Query() dto: GetAllProjectsDTO,
  ) {
    const projects = await this._projectService.getAllProjects({
      ...dto,
      workspaceId,
    });
    return ApiResponse.success(
      HttpStatus.OK,
      PROJECT.GET_ALL_PROJECTS,
      projects,
    );
  }
  @Patch(':projectId')
  async updateProject(
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const project = await this._projectService.updateProject(projectId, dto);
    return ApiResponse.success(
      HttpStatus.OK,
      PROJECT.PROJECT_UPDATED_SUCCESSFULLY,
      project,
    );
  }

  @Delete(':projectId')
  async deleteProject(@Param('projectId') projectId: string) {
    const deleteProject = await this._projectService.deleteProject(projectId);
    return ApiResponse.success(
      HttpStatus.OK,
      PROJECT.PROJECT_DELETED_SUCCESSFULLY,
      deleteProject,
    );
  }
  @Delete(':projectId/member/:userId')
  async removeMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    const deleteMember = await this._projectService.removeProjectMember(
      projectId,
      userId,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      PROJECT.PROJECT_MEMBER_REMOVED_SUCCESSFULLY,
      deleteMember,
    );
  }
}
