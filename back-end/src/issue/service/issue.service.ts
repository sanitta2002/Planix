import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IIssueService } from '../interface/IIssueService';
import type { IIssueRepository } from '../interface/IIssueRepository';
import { CreateIssueDTO } from '../dto/req/CreateIssueDTO';
import { IssueResponse } from '../dto/res/IssueResponse';
import {
  ISSUE_ERRORS,
  PROJECT_ERRORS,
} from 'src/common/constants/messages.constant';
import { IssueType } from 'src/common/type/IssueType';
import type { IprojectRepository } from 'src/project/interfaces/IProjectRepository';
import type { IRoleRepository } from 'src/role/interface/IRoleRepository';
import { IssueMapper } from './mapper/IssueMapper';
import type { IProjectMemberRepository } from 'src/project/interfaces/IProjectMemberRepository';
import { Types } from 'mongoose';
import { UpdateIssueDTO } from '../dto/req/UpdateIssueDTO';

@Injectable()
export class IssueService implements IIssueService {
  constructor(
    @Inject('IIssueRepository') private readonly _IissueRepo: IIssueRepository,
    @Inject('IprojectRepository')
    private readonly _projectRepo: IprojectRepository,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepo: IProjectMemberRepository,
    @Inject('IRoleRepository') private readonly _roleReop: IRoleRepository,
  ) {}
  async createIssue(
    dto: CreateIssueDTO,
    userId: string,
  ): Promise<IssueResponse> {
    console.log('**************', userId);
    if (!dto.title || !dto.title.trim()) {
      throw new BadRequestException(PROJECT_ERRORS.ISSUE_INVALIDATION);
    }
    if (dto.parentId) {
      const parent = await this._IissueRepo.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(ISSUE_ERRORS.PARENT_ISSUE_NOT_FOUND);
      }
      if (dto.issueType === IssueType.EPIC) {
        throw new BadRequestException(
          PROJECT_ERRORS.NON_EPIC_ISSUE_WITHOUT_PARENT,
        );
      }
      if (
        dto.issueType === IssueType.STORY &&
        parent.issueType !== IssueType.EPIC
      ) {
        throw new BadRequestException('Story must have Epic as parent');
      }
      if (
        (dto.issueType === IssueType.TASK || dto.issueType === IssueType.BUG) &&
        parent.issueType !== IssueType.STORY
      ) {
        throw new BadRequestException('Task/Bug must have Story as parent');
      }
      if (
        dto.issueType === IssueType.SUBTASK &&
        parent.issueType !== IssueType.TASK
      ) {
        throw new BadRequestException('Subtask must have Task as parent');
      }
    }
    const project = await this._projectRepo.findById(dto.projectId);
    if (!project) {
      throw new NotFoundException(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }
    const projectMember = await this._projectMemberRepo.findProjectAndUser(
      dto.projectId,
      userId,
    );
    if (!projectMember) {
      throw new ForbiddenException(PROJECT_ERRORS.MEMBER_NOT_FOUND);
    }
    if (dto.issueType !== IssueType.SUBTASK) {
      const role = await this._roleReop.findById(
        projectMember.roleId.toString(),
      );
      if (!role || role.name !== 'PROJECT_MANAGER') {
        throw new ForbiddenException('Not authorized');
      }
    }
    const nextNumber = await this._projectRepo.incrementIssueCounter(
      dto.projectId,
    );
    const key = `${project.key}-${nextNumber}`;
    const data = IssueMapper.toEntity(dto, userId);
    const issue = await this._IissueRepo.create({
      ...data,
      key,
    });
    return IssueMapper.toResponse(issue);
  }
  async getIssuesByProject(projectId: string): Promise<IssueResponse[]> {
    const project = await this._projectRepo.findById(projectId);
    if (!project) {
      throw new NotFoundException(PROJECT_ERRORS.NO_PROJECTS_FOUND);
    }
    const issues = await this._IissueRepo.findByProject(projectId);
    return issues.map((issue) => IssueMapper.toResponse(issue));
  }
  async updateIssue(
    id: string,
    dto: UpdateIssueDTO,
    userId: string,
  ): Promise<IssueResponse> {
    const issue = await this._IissueRepo.findById(id);
    if (!issue) {
      throw new NotFoundException(ISSUE_ERRORS.ISSUE_NOT_FOUND);
    }
    const projectMember = await this._projectMemberRepo.findProjectAndUser(
      issue.projectId.toString(),
      userId,
    );
    if (!projectMember) {
      throw new ForbiddenException(PROJECT_ERRORS.MEMBER_NOT_FOUND);
    }
    const updateData: Partial<typeof issue> = {};
    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.status) updateData.status = dto.status;
    if (dto.issueType) updateData.issueType = dto.issueType;
    if (dto.parentId) {
      const parent = await this._IissueRepo.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(ISSUE_ERRORS.PARENT_ISSUE_NOT_FOUND);
      }
      updateData.parentId = new Types.ObjectId(dto.parentId);
    }
    if (dto.sprintId) {
      updateData.sprintId = new Types.ObjectId(dto.sprintId);
    }

    if (dto.assigneeId) {
      updateData.assigneeId = dto.assigneeId;
    }

    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }

    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    if (dto.attachments) {
      updateData.attachments = dto.attachments;
    }
    const updatedIssue = await this._IissueRepo.updateById(id, updateData);

    if (!updatedIssue) {
      throw new BadRequestException('Update failed');
    }

    return IssueMapper.toResponse(updatedIssue);
  }
}
