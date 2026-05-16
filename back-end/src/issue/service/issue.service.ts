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
import { IssueMapper } from './mapper/IssueMapper';
import type { IProjectMemberRepository } from 'src/project/interfaces/IProjectMemberRepository';
import { Types } from 'mongoose';
import { UpdateIssueDTO } from '../dto/req/UpdateIssueDTO';
import { AddAttachmentDTO } from '../dto/req/AttachmentDTO';
import type { IS3Service } from 'src/common/s3/interfaces/s3.service.interface';

import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IssueAssignedEvent,
  IssueCreatedEvent,
  IssueStatusChangedEvent,
} from 'src/notification/events/notification.events';
import { NotificationType } from 'src/common/type/NotificationType';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class IssueService implements IIssueService {
  constructor(
    private readonly _logger: PinoLogger,
    @Inject('IIssueRepository') private readonly _IissueRepo: IIssueRepository,
    @Inject('IprojectRepository')
    private readonly _projectRepo: IprojectRepository,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepo: IProjectMemberRepository,
    @Inject('IS3Service') private readonly _S3Service: IS3Service,
    private readonly _eventEmitter: EventEmitter2,
  ) {}
  async createIssue(
    dto: CreateIssueDTO,
    userId: string,
  ): Promise<IssueResponse> {
    console.log('**************', userId);
    this._logger.info(`issue creationed by ${userId}`);
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
        throw new BadRequestException(ISSUE_ERRORS.STORY_PARENT_INVALID);
      }
      if (
        (dto.issueType === IssueType.TASK || dto.issueType === IssueType.BUG) &&
        parent.issueType !== IssueType.STORY
      ) {
        throw new BadRequestException(ISSUE_ERRORS.TASK_PARENT_INVALID);
      }
      if (
        dto.issueType === IssueType.SUBTASK &&
        parent.issueType !== IssueType.TASK
      ) {
        throw new BadRequestException(ISSUE_ERRORS.SUBTASK_PARENT_INVALID);
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
    const nextNumber = await this._projectRepo.incrementIssueCounter(
      dto.projectId,
    );
    const key = `${project.key}-${nextNumber}`;
    const data = IssueMapper.toEntity(dto, userId);
    const issue = await this._IissueRepo.create({
      ...data,
      key,
    });

    if (dto.issueType === IssueType.EPIC) {
      dto.assigneeId = undefined;
    }

    if (dto.assigneeId) {
      this._eventEmitter.emit(
        NotificationType.ISSUE_ASSIGNED,
        new IssueAssignedEvent(
          issue._id.toString(),
          issue.title,
          dto.assigneeId,
          userId,
        ),
      );
    }

    const projectMembers = await this._projectMemberRepo.getProjectMembers(
      dto.projectId,
    );
    const memberIds = projectMembers.map((m) => m.userId._id.toString());

    this._eventEmitter.emit(
      NotificationType.ISSUE_CREATED,
      new IssueCreatedEvent(
        issue._id.toString(),
        issue.title,
        userId,
        memberIds,
      ),
    );

    return IssueMapper.toResponse(issue);
  }
  async getIssuesByProject(projectId: string): Promise<IssueResponse[]> {
    this._logger.info(`${projectId}`);
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
      throw new BadRequestException(ISSUE_ERRORS.ISSUE_UPDATE_FAILED);
    }

    if (dto.assigneeId && dto.assigneeId !== issue.assigneeId?.toString()) {
      this._eventEmitter.emit(
        NotificationType.ISSUE_ASSIGNED,
        new IssueAssignedEvent(
          updatedIssue._id.toString(),
          updatedIssue.title,
          dto.assigneeId,
          userId,
        ),
      );
    }

    if (dto.status && dto.status !== issue.status) {
      const reporterId = issue.createdBy.toString();
      const assigneeId = issue.assigneeId?.toString();

      const receivers = new Set<string>();
      if (reporterId && reporterId !== userId) {
        receivers.add(reporterId);
      }
      if (assigneeId && assigneeId !== userId) {
        receivers.add(assigneeId);
      }

      receivers.forEach((receiverId) => {
        this._eventEmitter.emit(
          NotificationType.ISSUE_STATUS_CHANGED,
          new IssueStatusChangedEvent(
            updatedIssue._id.toString(),
            updatedIssue.title,
            issue.status,
            dto.status!,
            userId,
            receiverId,
          ),
        );
      });
    }

    return IssueMapper.toResponse(updatedIssue);
  }
  async addAttachments(
    issueId: string,
    dto: AddAttachmentDTO,
    userId: string,
    files?: Express.Multer.File[],
  ): Promise<IssueResponse> {
    console.log(dto);
    const issue = await this._IissueRepo.findById(issueId);

    if (!issue) {
      throw new NotFoundException(ISSUE_ERRORS.ISSUE_NOT_FOUND);
    }

    const fileAttachments = await Promise.all(
      (files || []).map(async (file) => {
        const { key } = await this._S3Service.uploadFile(
          file,
          userId,
          'issues',
        );

        const url = await this._S3Service.createSignedUrl(key);

        return {
          key,
          url,
          type: file.mimetype.startsWith('image') ? 'image' : 'document',
          fileName: file.originalname,
        };
      }),
    );

    const linkAttachments = (dto.link || []).map((url) => ({
      key: url,
      url: url,
      type: 'link',
      fileName: url,
    }));

    const updatedIssue = await this._IissueRepo.updateById(issueId, {
      attachments: [
        ...(issue.attachments || []),
        ...fileAttachments.map(({ key, type, fileName, url }) => ({
          key,
          type,
          fileName,
          url,
        })),
        ...linkAttachments.map(({ key, type, fileName, url }) => ({
          key,
          type,
          fileName,
          url,
        })),
      ],
    });

    if (!updatedIssue) {
      throw new BadRequestException('Failed to add attachments');
    }

    return IssueMapper.toResponse(updatedIssue);
  }
  async deleteAttachment(
    issueId: string,
    attachmentKey: string,
    userId: string,
  ): Promise<IssueResponse> {
    const issue = await this._IissueRepo.findById(issueId);

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

    const exists = (issue.attachments || []).some(
      (att) => att.key === attachmentKey,
    );

    if (!exists) {
      throw new NotFoundException('Attachment not found');
    }

    const updatedAttachments = (issue.attachments || []).filter(
      (att) => att.key !== attachmentKey,
    );

    const updatedIssue = await this._IissueRepo.updateById(issueId, {
      attachments: updatedAttachments,
    });

    if (!updatedIssue) {
      throw new BadRequestException('Failed to delete attachment');
    }
    try {
      await this._S3Service.deleteFile(attachmentKey);
    } catch (err) {
      this._logger.warn('S3 delete failed', err);
    }

    return IssueMapper.toResponse(updatedIssue);
  }
  async getAttachmentUrl(
    issueId: string,
    attachmentKey: string,
    userId: string,
  ): Promise<{ url: string }> {
    const issue = await this._IissueRepo.findById(issueId);

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

    const attachment = (issue.attachments || []).find(
      (att) => att.key === attachmentKey,
    );

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const url = await this._S3Service.createSignedUrl(attachmentKey);
    return { url };
  }
}
