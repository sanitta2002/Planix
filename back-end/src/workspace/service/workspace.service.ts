import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IWorkspaceService } from '../interface/IWorkspaceService';
import type { IWorkspaceRepository } from '../interface/IWorkspaceRepository';
import { CreateWorkspaceDto } from '../dto/req/CreateWorkspaceDto';
import { WorkspaceResponseDto } from '../dto/res/WorkspaceResponseDto';
import { Types } from 'mongoose';
import { WorkspaceMapper } from './Mapper/workspace.mapper';
import {
  GENERAL_MESSAGES,
  WORKSPACE_MESSAGE,
} from 'src/common/constants/messages.constant';
import { WorkspaceMembersResponseDto } from '../dto/res/WorkspaceMembersResponseDto';
import { PopulatedWorkspaceMember } from 'src/common/type/MemberType';
import { UpdateWorkspaceDto } from '../dto/req/UpdateWorkspaceDto';
import { WorkspaceLogoUploadResponseDto } from '../dto/res/WorkspaceLogoResDto';
import type { IS3Service } from 'src/common/s3/interfaces/s3.service.interface';
import { WorkspacePaymentResponseDto } from '../dto/res/WorkspacePaymentResponseDto';
import type { ISubscriptionRepository } from 'src/subscription/interface/ISubscriptionRepository';
import type { ISubscriptionPlanRepository } from 'src/subscription/interface/ISubscriptionPlanRepository';
import { SubscriptionPlanDocument } from 'src/subscription/Model/SubscriptionPlan.shema';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  private readonly _logger = new Logger(WorkspaceService.name);
  constructor(
    @Inject('IWorkspaceRepository')
    private readonly _workspaceRepository: IWorkspaceRepository,
    @Inject('IS3Service') private readonly _S3Service: IS3Service,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepo: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepo: ISubscriptionPlanRepository,
  ) {}

  async createWorkspace(
    userId: string,
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    console.log('USERID:', userId);
    console.log('DTO:', dto);
    this._logger.log(`creating workspace for user: ${userId}`);
    const existingWorkspace =
      await this._workspaceRepository.findByNameAndOwner(dto.name, userId);
    if (existingWorkspace) {
      throw new ConflictException(WORKSPACE_MESSAGE.CONFLICT);
    }
    const createdWorkspace = await this._workspaceRepository.create({
      name: dto.name,
      description: dto.description,
      ownerId: new Types.ObjectId(userId),
      members: [
        {
          user: new Types.ObjectId(userId),
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      subscriptionStatus: 'pending',
    });
    return WorkspaceMapper.toResponseDto(createdWorkspace);
  }

  async getUserWorkspaces(userId: string): Promise<WorkspaceResponseDto[]> {
    this._logger.log(`fetch workspaces for user: ${userId}`);
    const userWorkspaces = await this._workspaceRepository.findByUser(userId);
    return userWorkspaces.map((ws) => WorkspaceMapper.toResponseDto(ws));
  }

  async getWorkspaceMembers(
    workspaceId: string,
  ): Promise<WorkspaceMembersResponseDto> {
    const workspace =
      await this._workspaceRepository.findMembersByWorkspaceId(workspaceId);
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }

    const members = await Promise.all(
      (workspace.members as unknown as PopulatedWorkspaceMember[]).map(
        async (m) => {
          const avatarUrl = m.user.avatarKey
            ? await this._S3Service.createSignedUrl(m.user.avatarKey)
            : null;

          return {
            id: m.user._id.toString(),
            firstName: m.user.firstName,
            lastName: m.user.lastName,
            email: m.user.email,
            avatarUrl: avatarUrl,
            role: m.role,
            joinedAt: m.joinedAt,
          };
        },
      ),
    );
    console.log(members);
    return { workspaceId: workspace._id.toString(), members };
  }
  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    const workspace = await this._workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }

    const memberIndex = workspace.members.findIndex(
      (m) => m.user.toString() === memberId,
    );
    if (memberIndex === -1) {
      throw new NotFoundException('Member not found');
    }

    if (workspace.members[memberIndex].role === 'owner') {
      throw new ConflictException('Owner cannot be removed');
    }

    workspace.members.splice(memberIndex, 1);

    await workspace.save();
  }
  async updateWorkspace(
    workspaceId: string,
    userId: string,
    dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    const existingWorkspace =
      await this._workspaceRepository.findById(workspaceId);
    if (!existingWorkspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    if (existingWorkspace.ownerId.toString() !== userId) {
      throw new ForbiddenException('Only owner can update workspace');
    }
    const updatedWorkspace = await this._workspaceRepository.updateById(
      workspaceId,
      {
        name: dto.name,
        description: dto.description,
        logo: dto.logo,
      },
    );
    return WorkspaceMapper.toResponseDto(updatedWorkspace!);
  }

  async uploadWorkspaceLogo(
    workspaceId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<WorkspaceLogoUploadResponseDto> {
    if (!file) {
      throw new BadRequestException(GENERAL_MESSAGES.FILE_REQUIRED);
    }
    const workspace = await this._workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    if (workspace.ownerId.toString() !== userId) {
      throw new UnauthorizedException('Only owner can update logo');
    }
    if (workspace.logo) {
      await this._S3Service.deleteFile(workspace.logo);
    }
    const { key } = await this._S3Service.uploadFile(
      file,
      workspaceId,
      'workspace-logos',
    );
    await this._workspaceRepository.updateById(workspaceId, {
      logo: key,
    });
    const logoUrl = await this._S3Service.createSignedUrl(key);
    return { logo: key, logoUrl };
  }

  async getWorkspaceProfile(
    workspaceId: string,
  ): Promise<WorkspaceResponseDto> {
    const workspace = await this._workspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }

    const logoUrl = workspace.logo
      ? await this._S3Service.createSignedUrl(workspace.logo)
      : null;

    return { ...WorkspaceMapper.toResponseDto(workspace, logoUrl) };
  }

  async getWorkspacePaymentDetails(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspacePaymentResponseDto> {
    const workspace = await this._workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    if (workspace.ownerId.toString() !== userId) {
      throw new ForbiddenException('Only owner can view payment details');
    }
    const subscription =
      await this._subscriptionRepo.findActiveByWorkspace(workspaceId);
    if (!subscription) {
      return {
        subscriptionId: null,
        workspaceId: workspace._id.toString(),
        plan: null,
        amount: 0,
        status: workspace.subscriptionStatus,
        startDate: null,
        endDate: null,
        features: [],
        stripeSubscriptionId: null,
        invoiceId: null,
      };
    }
    const plan = subscription.planId as unknown as SubscriptionPlanDocument;
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return {
      subscriptionId: subscription._id.toString(),
      workspaceId: workspace._id.toString(),
      plan: plan.name,
      amount: plan.price,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      features: plan.features,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      invoiceId: subscription.latestInvoiceId,
    };
  }
}
