import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IprojectRepository } from '@/project/interfaces/IProjectRepository';
import type { IProjectMemberRepository } from '@/project/interfaces/IProjectMemberRepository';
import type { IIssueRepository } from '@/issue/interface/IIssueRepository';
import type { IsprintRepository } from '@/sprint/interface/IsprintRepository';
import type { IUserRepository } from '@/users/interfaces/user.repository.interface';
import type { IS3Service } from '@/common/s3/interfaces/s3.service.interface';
import { IssueStatus } from '@/common/type/IssueStatus';
import { IssueType } from '@/common/type/IssueType';
import { SprintStatus } from '@/common/type/SprintStatus';
import { IUserDashboardService } from '@/dashboard/user-dashboard/interface/IUserDashboardService';
import { IUserDashboardResponse } from '../dto/UserDashboardResponse';

@Injectable()
export class UserDashboardService implements IUserDashboardService {
  constructor(
    @Inject('IprojectRepository')
    private readonly _projectRepository: IprojectRepository,

    @Inject('IProjectMemberRepository')
    private readonly _projectMemberRepository: IProjectMemberRepository,

    @Inject('IIssueRepository')
    private readonly _issueRepository: IIssueRepository,

    @Inject('IsprintRepository')
    private readonly _sprintRepository: IsprintRepository,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IS3Service')
    private readonly _S3Service: IS3Service,
  ) {}

  async getDashboardData(
    projectId: string,
    loggedInUserId: string,
  ): Promise<IUserDashboardResponse> {
    const project = await this._projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const creator = await this._userRepository.findById(
      project.createdBy.toString(),
    );
    const creatorName = creator
      ? `${creator.firstName} ${creator.lastName}`
      : 'System Admin';

    const issues = await this._issueRepository.findByProject(projectId);
    const totalIssues = issues ? issues.length : 0;
    const sprints = await this._sprintRepository.findByProject(projectId);
    const activeSprint = sprints.find((s) => s.status === SprintStatus.ACTIVE);
    const activeSprintsCount = sprints.filter(
      (s) => s.status === SprintStatus.ACTIVE,
    ).length;
    const members =
      await this._projectMemberRepository.getProjectMembers(projectId);

    const completedIssues = issues.filter(
      (i) => i.status === IssueStatus.DONE,
    ).length;
    const epics = issues.filter((i) => i.issueType === IssueType.EPIC);
    const openEpicsCount = epics.filter(
      (i) => i.status !== IssueStatus.DONE,
    ).length;
    const completedPercentage =
      totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

    const overallProgress = {
      completedCount: completedIssues,
      totalCount: totalIssues,
      percentage: completedPercentage,
      description: `${completedIssues} of ${totalIssues} issues completed across all sprints`,
    };
    const memberUsers = await Promise.all(
      members.map(async (m) => {
        const mId = m.userId?._id?.toString() || m.userId._id?.toString();
        if (!mId) return null;
        const userProfile = await this._userRepository.findById(mId);
        if (!userProfile) return null;
        const avatarUrl = userProfile.avatarKey
          ? await this._S3Service.createSignedUrl(userProfile.avatarKey)
          : null;
        return {
          id: mId,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          avatarUrl,
          role: m.roleId?.name,
        };
      }),
    );
    const activeMembers = memberUsers.filter(
      (m): m is NonNullable<typeof m> => !!m,
    );

    const timeSpentByTeam = activeMembers.map((m) => {
      const memberIssues = issues.filter(
        (i) => i.assigneeId?.toString() === m.id,
      );
      const completed = memberIssues.filter(
        (i) => i.status === IssueStatus.DONE,
      ).length;

      const remainingHours = memberIssues
        .filter((i) => i.status !== IssueStatus.DONE)
        .reduce((sum, i) => sum + (i.estimatedHours || 0), 0);

      return {
        id: m.id,
        name: `${m.firstName} ${m.lastName}`.trim(),

        remainingHours: remainingHours,
        issuesCompleted: completed,
        avatar:
          m.avatarUrl ||
          `${m.firstName[0]}${m.lastName[0] || ''}`.toUpperCase(),
        role: m.role,
      };
    });

    let topPerformer: {
      name: string;
      role: string;
      avatar?: string;
      issuesCompleted: number;
      avgCycleTime: number;
    } | null = null;
    if (timeSpentByTeam.length > 0) {
      const sortedByCompleted = [...timeSpentByTeam].sort(
        (a, b) => b.issuesCompleted - a.issuesCompleted,
      );
      const top = sortedByCompleted[0];

      let avgCycleTime = 0;
      if (top.issuesCompleted > 0) {
        const topIssues = issues.filter(
          (i) =>
            i.assigneeId?.toString() === top.id &&
            i.status === IssueStatus.DONE,
        );
        let totalCycleTime = 0;
        topIssues.forEach((i) => {
          const created = new Date(i.createdAt).getTime();
          const updated = new Date(i.updatedAt).getTime();
          totalCycleTime += (updated - created) / (1000 * 60 * 60 * 24);
        });
        avgCycleTime = parseFloat(
          (totalCycleTime / topIssues.length).toFixed(1),
        );
      }

      topPerformer = {
        name: top.name,
        role: top.role,
        avatar: top.avatar,
        issuesCompleted: top.issuesCompleted,
        avgCycleTime,
      };
    }

    let loggedInUser = activeMembers.find((m) => m.id === loggedInUserId);
    if (!loggedInUser) {
      const userProfile = await this._userRepository.findById(loggedInUserId);
      if (userProfile) {
        const avatarUrl = userProfile.avatarKey
          ? await this._S3Service.createSignedUrl(userProfile.avatarKey)
          : null;
        loggedInUser = {
          id: loggedInUserId,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          avatarUrl,
          role: 'Contributor',
        };
      }
    }

    const myIssues = issues.filter(
      (i) => i.assigneeId?.toString() === loggedInUserId,
    );
    const myCompleted = myIssues.filter(
      (i) => i.status === IssueStatus.DONE,
    ).length;
    const myRemainingHours = myIssues
      .filter((i) => i.status !== IssueStatus.DONE)
      .reduce((sum, i) => sum + (i.estimatedHours || 0), 0);

    const myProgress = {
      name: loggedInUser
        ? `${loggedInUser.firstName} ${loggedInUser.lastName}`.trim()
        : 'My Progress',
      role: loggedInUser ? loggedInUser.role : 'Contributor',
      avatar: loggedInUser?.avatarUrl || 'ME',
      remainingHours: myRemainingHours,
      issuesCompleted: myCompleted,
      totalIssuesAssigned: myIssues.length,
      percentage:
        myIssues.length > 0
          ? Math.round((myCompleted / myIssues.length) * 100)
          : 0,
    };

    const issuesByType = {
      epic: issues.filter((i) => i.issueType === IssueType.EPIC).length,
      story: issues.filter((i) => i.issueType === IssueType.STORY).length,
      task: issues.filter((i) => i.issueType === IssueType.TASK).length,
      bug: issues.filter((i) => i.issueType === IssueType.BUG).length,
      subtask: issues.filter((i) => i.issueType === IssueType.SUBTASK).length,
    };

    const todoCount = issues.filter(
      (i) => i.status === IssueStatus.TODO,
    ).length;
    const inProgressCount = issues.filter(
      (i) => i.status === IssueStatus.IN_PROGRESS,
    ).length;
    const doneCount = completedIssues;
    const reviewCount = issues.filter(
      (i) => i.status === IssueStatus.HOLD || i.status === IssueStatus.BLOCKED,
    ).length;

    const issueStatusDistribution = {
      todo: {
        count: todoCount,
        percentage:
          totalIssues > 0 ? Math.round((todoCount / totalIssues) * 100) : 0,
      },
      inProgress: {
        count: inProgressCount,
        percentage:
          totalIssues > 0
            ? Math.round((inProgressCount / totalIssues) * 100)
            : 0,
      },
      done: {
        count: doneCount,
        percentage:
          totalIssues > 0 ? Math.round((doneCount / totalIssues) * 100) : 0,
      },
      review: {
        count: reviewCount,
        percentage:
          totalIssues > 0 ? Math.round((reviewCount / totalIssues) * 100) : 0,
      },
    };
    let currentSprintDetails: {
      sprintId: string;
      sprintName: string;
      startDate: string;
      endDate: string;
      daysRemaining: number;
      completedCount: number;
      totalCount: number;
      percentage: number;
      statusBreakdown: {
        todo: number;
        inProgress: number;
        review: number;
        done: number;
      };
    } | null = null;
    const activeOrLastSprint = activeSprint || sprints[sprints.length - 1];

    if (activeOrLastSprint) {
      const sprintIssues = issues.filter(
        (i) => i.sprintId?.toString() === activeOrLastSprint._id.toString(),
      );
      const sTodo = sprintIssues.filter(
        (i) => i.status === IssueStatus.TODO,
      ).length;
      const sInProgress = sprintIssues.filter(
        (i) => i.status === IssueStatus.IN_PROGRESS,
      ).length;
      const sReview = sprintIssues.filter(
        (i) =>
          i.status === IssueStatus.HOLD || i.status === IssueStatus.BLOCKED,
      ).length;
      const sDone = sprintIssues.filter(
        (i) => i.status === IssueStatus.DONE,
      ).length;
      const sTotal = sprintIssues.length;
      const sPercentage = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0;

      let daysRemaining = 0;
      if (activeOrLastSprint.endDate) {
        const end = new Date(activeOrLastSprint.endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        daysRemaining = Math.max(
          0,
          Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
        );
      }

      currentSprintDetails = {
        sprintId: activeOrLastSprint._id.toString(),
        sprintName: activeOrLastSprint.name,
        startDate: activeOrLastSprint.startDate
          ? new Date(activeOrLastSprint.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : 'N/A',
        endDate: activeOrLastSprint.endDate
          ? new Date(activeOrLastSprint.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : 'N/A',
        daysRemaining,
        completedCount: sDone,
        totalCount: sTotal,
        percentage: sPercentage,
        statusBreakdown: {
          todo: sTodo,
          inProgress: sInProgress,
          review: sReview,
          done: sDone,
        },
      };
    }
    const epicsOverview = epics.map((epic) => {
      const childIssues = issues.filter(
        (i) => i.parentId?.toString() === epic._id.toString(),
      );
      const cTotal = childIssues.length;
      const cCompleted = childIssues.filter(
        (i) => i.status === IssueStatus.DONE,
      ).length;
      const cPercentage =
        cTotal > 0 ? Math.round((cCompleted / cTotal) * 100) : 0;

      let status: 'On Track' | 'In Progress' | 'At Risk' = 'In Progress';
      if (cPercentage >= 75) {
        status = 'On Track';
      } else if (cPercentage < 30) {
        status = 'At Risk';
      }

      return {
        id: epic._id.toString(),
        title: epic.title,
        completedIssues: cCompleted,
        totalIssues: cTotal,
        percentage: cPercentage,
        status,
      };
    });

    return {
      projectHeader: {
        projectName: project.projectName,
        key: project.key,
        description: project.description,
        startDate: project.createdAt
          ? new Date(project.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'N/A',
        endDate: 'Future Milestone',
        status:
          completedPercentage >= 75
            ? 'On Track'
            : completedPercentage >= 30
              ? 'In Progress'
              : 'At Risk',
        owner: {
          id: project.createdBy.toString(),
          name: creatorName,
        },
        updatedAt: project.updatedAt,
      },
      metrics: {
        totalIssues,
        openEpics: openEpicsCount,
        completedIssues,
        completedPercentage,
        activeSprints: activeSprintsCount,
      },
      overallProgress,
      myProgress,
      timeSpentByTeam,
      topPerformer,
      issuesByType,
      issueStatusDistribution,
      currentSprint: currentSprintDetails,
      epicsOverview,
    };
  }
}
