import { Inject, Injectable } from '@nestjs/common';
import type { INotificationService } from '../interface/INotificationService';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType } from 'src/common/type/NotificationType';
import {
  IssueAssignedEvent,
  IssueCommentedEvent,
  ProjectMemberEvent,
  SprintStartedEvent,
} from '../events/notification.events';
import { Types } from 'mongoose';
import { NOTIFICATION_TEMPLATES } from 'src/common/constants/messages.constant';

import { NotificationGateway } from '../gateway/notification.gateway';

@Injectable()
export class NotificationListener {
  constructor(
    @Inject('INotificationService')
    private readonly _notificationService: INotificationService,
    private readonly _notificationGateway: NotificationGateway,
  ) {}

  @OnEvent(NotificationType.ISSUE_ASSIGNED)
  async handleIssueAssigned(event: IssueAssignedEvent) {
    const notification = await this._notificationService.createNotification({
      receiver: new Types.ObjectId(event.assigneeId),
      sender: new Types.ObjectId(event.actorId),
      notificationType: NotificationType.ISSUE_ASSIGNED,
      message: NOTIFICATION_TEMPLATES.ISSUE_ASSIGNED(event.issueTitle),
      referenceId: new Types.ObjectId(event.issueId),
    });

    if (notification) {
      this._notificationGateway.sendNotification(
        event.assigneeId,
        notification,
      );
    }
  }

  @OnEvent(NotificationType.ISSUE_COMMENTED)
  async handleIssueCommented(event: IssueCommentedEvent) {
    const notification = await this._notificationService.createNotification({
      receiver: new Types.ObjectId(event.receiverId),
      sender: new Types.ObjectId(event.senderId),
      notificationType: NotificationType.ISSUE_COMMENTED,
      message: `${event.issueTitle}: ${event.commentContent.substring(0, 50)}...`,
      referenceId: new Types.ObjectId(event.issueId),
    });

    if (notification) {
      this._notificationGateway.sendNotification(
        event.receiverId,
        notification,
      );
    }
  }

  @OnEvent(NotificationType.PROJECT_MEMBER_ADDED)
  async handleProjectMemberAdded(event: ProjectMemberEvent) {
    const notification = await this._notificationService.createNotification({
      receiver: new Types.ObjectId(event.memberId),
      sender: new Types.ObjectId(event.actorId),
      notificationType: NotificationType.PROJECT_MEMBER_ADDED,
      message: NOTIFICATION_TEMPLATES.PROJECT_MEMBER_ADDED(event.projectName),
      referenceId: new Types.ObjectId(event.projectId),
    });

    if (notification) {
      this._notificationGateway.sendNotification(event.memberId, notification);
    }
  }

  @OnEvent(NotificationType.SPRINT_STARTED)
  async handleSprintStarted(event: SprintStartedEvent) {
    const actorId = new Types.ObjectId(event.actorId);
    const sprintId = new Types.ObjectId(event.sprintId);

    const promises = event.projectMembers
      .filter((memberId) => memberId !== event.actorId)
      .map(async (memberId) => {
        const notification = await this._notificationService.createNotification(
          {
            receiver: new Types.ObjectId(memberId),
            sender: actorId,
            notificationType: NotificationType.SPRINT_STARTED,
            message: NOTIFICATION_TEMPLATES.SPRINT_STARTED(event.sprintName),
            referenceId: sprintId,
          },
        );

        if (notification) {
          this._notificationGateway.sendNotification(memberId, notification);
        }
        return notification;
      });

    await Promise.all(promises);
  }
}
