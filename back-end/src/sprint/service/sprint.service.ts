import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IsprintRepository } from '../interface/IsprintRepository';
import { CreateSprintDto } from '../dto/req/CreateSprintDto';

import { SPRINT_MESSAGES } from 'src/common/constants/messages.constant';
import { SprintMapper } from './mapper/sprintMapper';
import { SprintResponse } from '../dto/res/SprintResponse';
import { ISprintservice } from '../interface/IsprintSerivce';
import { SprintStatus } from 'src/common/type/SprintStatus';
import { UpdateSprintDto } from '../dto/req/UpdateSprintDto ';
import type { IIssueRepository } from 'src/issue/interface/IIssueRepository';
import { PinoLogger } from 'nestjs-pino';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { SprintStartedEvent } from 'src/notification/events/notification.events';
import { NotificationType } from 'src/common/type/NotificationType';
import type { IProjectMemberRepository } from 'src/project/interfaces/IProjectMemberRepository';

@Injectable()
export class SprintService implements ISprintservice {
  constructor(
    private readonly _logger: PinoLogger,
    @Inject('IsprintRepository')
    private readonly _sprintRepo: IsprintRepository,
    @Inject('IIssueRepository')
    private readonly _issueRepo: IIssueRepository,
    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepo: IProjectMemberRepository,
    private readonly _eventEmitter: EventEmitter2,
  ) {}
  async createSprint(
    dto: CreateSprintDto,
    userId: string,
  ): Promise<SprintResponse> {
    this._logger.info(`creating sprint: ${dto.projectId}`);
    const { projectId, startDate, endDate } = dto;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new BadRequestException(SPRINT_MESSAGES.INVALID_DATES);
      }
    }
    const activeSprint = await this._sprintRepo.findActiveSprint(projectId);
    if (activeSprint) {
      throw new BadRequestException(SPRINT_MESSAGES.ACTIVE_SPRINT_EXISTS);
    }

    const sprintEntity = SprintMapper.toEntity(dto, userId);

    const sprint = await this._sprintRepo.create(sprintEntity);
    this._logger.info(`sprint created success: ${sprint._id.toString()}`);
    return SprintMapper.toResponse(sprint);
  }
  async getSprintsByProject(projectId: string): Promise<SprintResponse[]> {
    const sprints = await this._sprintRepo.findByProject(projectId);
    return sprints.map((sprint) => SprintMapper.toResponse(sprint));
  }
  async startSprint(
    dto: UpdateSprintDto,
    sprintId: string,
    userId: string,
  ): Promise<SprintResponse> {
    this._logger.info(`Starting sprint: ${sprintId}`);

    if (!sprintId) {
      throw new BadRequestException(SPRINT_MESSAGES.INVALID_SPRINT_ID);
    }

    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new NotFoundException(SPRINT_MESSAGES.SPRINT_NOT_FOUND);
    }

    if (sprint.status !== SprintStatus.PLANNED) {
      if (sprint.status === SprintStatus.ACTIVE) {
        throw new BadRequestException(SPRINT_MESSAGES.SPRINT_ALREADY_ACTIVE);
      }
      if (sprint.status === SprintStatus.COMPLETED) {
        throw new BadRequestException(SPRINT_MESSAGES.SPRINT_ALREADY_COMPLETED);
      }
      throw new BadRequestException(SPRINT_MESSAGES.ONLY_PLANNED_CAN_START);
    }

    if (!dto.startDate || !dto.endDate) {
      throw new BadRequestException(SPRINT_MESSAGES.REQUIRED_FIELDS);
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(SPRINT_MESSAGES.INVALID_DATE_FORMAT);
    }

    if (start >= end) {
      throw new BadRequestException(SPRINT_MESSAGES.INVALID_DATES);
    }

    const activeSprint = await this._sprintRepo.findActiveSprint(
      sprint.projectId.toString(),
    );

    if (activeSprint && activeSprint._id.toString() !== sprintId) {
      throw new BadRequestException(SPRINT_MESSAGES.ACTIVE_SPRINT_EXISTS);
    }

    const updatedSprint = await this._sprintRepo.updateById(sprintId, {
      status: SprintStatus.ACTIVE,
      startDate: start,
      endDate: end,
      goal: dto.goal ?? sprint.goal,
    });

    if (!updatedSprint) {
      throw new NotFoundException(SPRINT_MESSAGES.SPRINT_NOT_FOUND);
    }

    this._logger.info(`Sprint started successfully: ${sprintId}`);

    const members = await this._projectMemberRepo.getProjectMembers(
      updatedSprint.projectId.toString(),
    );
    const memberIds = members.map((m) => m.userId._id.toString());

    this._eventEmitter.emit(
      NotificationType.SPRINT_STARTED,
      new SprintStartedEvent(
        updatedSprint._id.toString(),
        updatedSprint.name,
        memberIds,
        userId,
      ),
    );

    return SprintMapper.toResponse(updatedSprint);
  }

  async completeSprint(
    dto: UpdateSprintDto,
    sprintId: string,
    userId: string,
  ): Promise<SprintResponse> {
    this._logger.info(`Completing sprint: ${sprintId}`);

    if (!sprintId) {
      throw new BadRequestException(SPRINT_MESSAGES.INVALID_SPRINT_ID);
    }

    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new NotFoundException(SPRINT_MESSAGES.SPRINT_NOT_FOUND);
    }

    if (sprint.status !== SprintStatus.ACTIVE) {
      if (sprint.status === SprintStatus.PLANNED) {
        throw new BadRequestException(SPRINT_MESSAGES.SPRINT_NOT_STARTED);
      }
      if (sprint.status === SprintStatus.COMPLETED) {
        throw new BadRequestException(SPRINT_MESSAGES.SPRINT_ALREADY_COMPLETED);
      }
    }

    await this._issueRepo.moveIncompleteIssues(
      sprintId,
      dto.moveToSprintId ?? null,
    );

    const updatedSprint = await this._sprintRepo.updateById(sprintId, {
      status: SprintStatus.COMPLETED,
      endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
    });

    if (!updatedSprint) {
      throw new NotFoundException(SPRINT_MESSAGES.SPRINT_NOT_FOUND);
    }

    this._logger.info(`Sprint completed successfully: ${sprintId}`);

    const members = await this._projectMemberRepo.getProjectMembers(
      updatedSprint.projectId.toString(),
    );
    const memberIds = members.map((m) => m.userId._id.toString());

    this._eventEmitter.emit(
      NotificationType.SPRINT_COMPLETED,
      new SprintStartedEvent(
        updatedSprint._id.toString(),
        updatedSprint.name,
        memberIds,
        userId,
      ),
    );

    return SprintMapper.toResponse(updatedSprint);
  }
}
