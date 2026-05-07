import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import type { IProjectMemberRepository } from 'src/project/interfaces/IProjectMemberRepository';
import type { IRoleRepository } from 'src/role/interface/IRoleRepository';
import type { IIssueRepository } from 'src/issue/interface/IIssueRepository';
import type { IsprintRepository } from 'src/sprint/interface/IsprintRepository';

export interface RequestUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ProjectPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('IProjectMemberRepository')
    private projectMemberRepo: IProjectMemberRepository,
    @Inject('IRoleRepository')
    private roleRepo: IRoleRepository,
    @Optional()
    @Inject('IIssueRepository')
    private issueRepo?: IIssueRepository,
    @Optional()
    @Inject('IsprintRepository')
    private sprintRepo?: IsprintRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePermissions =
      this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler()) || [];

    const requiredPermissions = [...routePermissions];

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    const body = request.body as { issueType?: string } | undefined;
    if (request.method === 'POST' && body?.issueType) {
      if (body.issueType.toLowerCase() === 'epic') {
        requiredPermissions.push('CREATE_EPIC');
      } else {
        requiredPermissions.push('CREATE_TASK');
      }
    }

    if (!user || !user.userId) {
      throw new ForbiddenException('user not authenticated');
    }

    let projectId: string =
      (request.body as { projectId?: string })?.projectId ||
      (request.params?.projectId as string | undefined) ||
      ((request.query as { projectId?: string })?.projectId as string);

    if (!projectId && request.params?.id) {
      if (this.issueRepo) {
        const issue = await this.issueRepo.findById(
          request.params.id as string,
        );
        if (issue) {
          projectId = issue.projectId.toString();
        }
      }
    }

    if (!projectId && request.params?.issueId) {
      if (this.issueRepo) {
        const issue = await this.issueRepo.findById(
          request.params.issueId as string,
        );
        if (issue) {
          projectId = issue.projectId.toString();
        }
      }
    }

    if (!projectId && request.params?.sprintId) {
      if (this.sprintRepo) {
        const sprint = await this.sprintRepo.findById(
          request.params.sprintId as string,
        );
        if (sprint) {
          projectId = sprint.projectId.toString();
        }
      }
    }

    if (!projectId) {
      throw new ForbiddenException('project ID not determined');
    }

    const projectMember = await this.projectMemberRepo.findProjectAndUser(
      projectId,
      user.userId,
    );

    if (!projectMember) {
      throw new ForbiddenException('user is not a member of this project');
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const role = await this.roleRepo.findById(projectMember.roleId.toString());

    if (!role) {
      throw new ForbiddenException('role not found for user in this project');
    }

    const hasPermission = requiredPermissions.every((perm) =>
      role.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Missing required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
