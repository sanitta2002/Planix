import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IsprintRepository } from '@/sprint/interface/IsprintRepository';
import { CreateSprintDto } from '@/sprint/dto/req/CreateSprintDto';

import { SPRINT_MESSAGES } from '@/common/constants/messages.constant';
import { SprintMapper } from '@/sprint/service/mapper/sprintMapper';
import { SprintResponse } from '@/sprint/dto/res/SprintResponse';
import { ISprintservice } from '@/sprint/interface/IsprintSerivce';
import { SprintStatus } from '@/common/type/SprintStatus';
import { UpdateSprintDto } from '@/sprint/dto/req/UpdateSprintDto ';
import type { IIssueRepository } from '@/issue/interface/IIssueRepository';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { SprintStartedEvent } from '@/notification/events/notification.events';
import { NotificationType } from '@/common/type/NotificationType';
import type { IProjectMemberRepository } from '@/project/interfaces/IProjectMemberRepository';
import type { ILogger } from '@/logger/ILogger';
import { BurndownResponse } from '../dto/res/BurndownResponse';
import { IssueType } from '@/common/type/IssueType';
import { IssueStatus } from '@/common/type/IssueStatus';

@Injectable()
export class SprintService implements ISprintservice {
  constructor(
    @Inject('ILogger')
    private readonly _logger: ILogger,
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
  async getBurndownData(sprintId: string): Promise<BurndownResponse> {
    const sprint = await this._sprintRepo.findById(sprintId);
    if (!sprint) {
      throw new NotFoundException(SPRINT_MESSAGES.SPRINT_NOT_FOUND);
    }

    const issues = await this._issueRepo.findBySprint(sprintId);
    const countableIssues = issues.filter(
      (issue) => issue.issueType !== IssueType.EPIC,
    );

    const totalPoints = countableIssues.reduce(
      (sum, issue) => sum + (issue.storyPoints || 0),
      0,
    );
    const totalHours = countableIssues.reduce(
      (sum, issue) => sum + (issue.estimatedHours || 0),
      0,
    );

    const completedIssues = countableIssues.filter(
      (issue) => issue.status === IssueStatus.DONE,
    );
    const completedPoints = completedIssues.reduce(
      (sum, issue) => sum + (issue.storyPoints || 0),
      0,
    );
    const completedHours = completedIssues.reduce(
      (sum, issue) => sum + (issue.estimatedHours || 0),
      0,
    );
    const trendData: BurndownResponse['trendData'] = [];

    if (sprint.startDate && sprint.endDate) {
      const start = new Date(sprint.startDate);
      const end = new Date(sprint.endDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const totalDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (totalDays > 0) {
        const idealPointsPerDay = totalPoints / totalDays;
        const idealHoursPerDay = totalHours / totalDays;

        for (let i = 0; i <= totalDays; i++) {
          const currentDay = new Date(start);
          currentDay.setDate(currentDay.getDate() + i);

          const dayLabel = currentDay.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          const idealPoints = Math.max(
            0,
            Math.round((totalPoints - idealPointsPerDay * i) * 10) / 10,
          );
          const idealHours = Math.max(
            0,
            Math.round((totalHours - idealHoursPerDay * i) * 10) / 10,
          );

          let actualPoints: number | null = null;
          let actualHours: number | null = null;

          if (currentDay <= today) {
            const endOfDay = new Date(currentDay);
            endOfDay.setHours(23, 59, 59, 999);

            let donePoints = 0;
            let doneHours = 0;

            completedIssues.forEach((issue) => {
              const completedDate = issue.completedAt
                ? new Date(issue.completedAt)
                : issue.updatedAt
                  ? new Date(issue.updatedAt)
                  : null;

              if (completedDate && completedDate <= endOfDay) {
                donePoints += issue.storyPoints || 0;
                doneHours += issue.estimatedHours || 0;
              }
            });

            actualPoints = Math.max(0, totalPoints - donePoints);
            actualHours = Math.max(0, totalHours - doneHours);
          }

          trendData.push({
            day: dayLabel,
            idealPoints,
            actualPoints: actualPoints !== null ? actualPoints : idealPoints,
            idealHours,
            actualHours: actualHours !== null ? actualHours : idealHours,
          });
        }
      }
    }

    return {
      sprintId: sprint._id.toString(),
      sprintName: sprint.name,
      totalPoints,
      completedPoints,
      remainingPoints: totalPoints - completedPoints,
      totalHours,
      completedHours,
      remainingHours: totalHours - completedHours,
      trendData,
    };
  }
}
