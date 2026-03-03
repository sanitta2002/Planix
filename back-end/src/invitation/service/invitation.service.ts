import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IInvitationService } from '../interface/IInvitationService';
import type { IInvitationRepository } from '../interface/IInvitationRepository';
import type { IWorkspaceRepository } from 'src/workspace/interface/IWorkspaceRepository';
import { InvitationResponseDto } from '../dto/res/InvitationResponseDto';
import { InviteMemberDto } from '../dto/req/InviteMemberDto';
import {
  INVITE_MESSAGE,
  WORKSPACE_MESSAGE,
} from 'src/common/constants/messages.constant';
import { randomBytes } from 'crypto';
import { InvitationMapper } from './mapper/InvitationMapper';
import type { IMailService } from 'src/common/mail/interfaces/mail.interface';
import { ConfigService } from '@nestjs/config';
import type { IUserRepository } from 'src/users/interfaces/user.repository.interface';
import type { IJwtService } from 'src/common/jwt/interfaces/jwt.service.interface';
import { AcceptInvitationResponseDto } from '../dto/res/AcceptInvitationResponseDto';
import { CompleteProfileDto } from '../dto/req/CompleteProfileDto';
import type { IHashingService } from 'src/common/hashing/interface/hashing.service.interface';

@Injectable()
export class InvitationService implements IInvitationService {
  private readonly _logger = new Logger(InvitationService.name);
  constructor(
    @Inject('IInvitationRepository')
    private readonly _invitationRepo: IInvitationRepository,
    @Inject('IWorkspaceRepository')
    readonly _workspaceRepo: IWorkspaceRepository,
    @Inject('IMailService') private readonly __mailService: IMailService,
    private readonly _configService: ConfigService,
    @Inject('IUserRepository') private readonly _userRepo: IUserRepository,
    @Inject('IJwtService') private readonly _jwtService: IJwtService,
    @Inject('IHashingService')
    private readonly _hashingService: IHashingService,
  ) {}
  async inviteMember(
    workspaceId: string,
    dto: InviteMemberDto,
    currentUserId: string,
  ): Promise<InvitationResponseDto> {
    this._logger.log(
      `invite request by user ${currentUserId} for workspace ${workspaceId}`,
    );
    const workspace = await this._workspaceRepo.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException(WORKSPACE_MESSAGE.NOT_FOUND);
    }
    const inviter = workspace.members.find(
      (m) => m.user.toString() === currentUserId,
    );
    if (!inviter || inviter.role !== 'owner') {
      throw new ForbiddenException(INVITE_MESSAGE.FORBIDDEN);
    }
    const existingInvite = await this._invitationRepo.findPending(
      workspaceId,
      dto.email,
    );
    if (existingInvite) {
      throw new BadRequestException(INVITE_MESSAGE.BADREQUEST);
    }
    const token = randomBytes(32).toString('hex');
    console.log('*********', token);
    const invitationData = InvitationMapper.toPersistence(
      workspaceId,
      dto.email,
      dto.name,
      inviter.user,
      token,
    );
    this._logger.log(invitationData);
    await this._invitationRepo.create(invitationData);
    const frontendUrl = this._configService.get<string>('FRONTEND_URL');
    const inviteLink = `${frontendUrl}/invite/${token}`;
    await this.__mailService.sendInvitationMail(dto.email, inviteLink);
    this._logger.log(`invitation email sent to ${dto.email}`);
    return { message: INVITE_MESSAGE.SUCCESS };
  }
  async acceptInvitation(token: string): Promise<AcceptInvitationResponseDto> {
    this._logger.log(`accept invitation with token: ${token}`);
    const invitation = await this._invitationRepo.findByToken(token);
    if (!invitation) {
      throw new NotFoundException(INVITE_MESSAGE.INVALID);
    }
    if (invitation.status !== 'pending') {
      throw new BadRequestException(INVITE_MESSAGE.CONFLICT);
    }
    const existingUser = await this._userRepo.findByEmail(invitation.email);

    if (!existingUser) {
      return {
        needsProfileCompletion: true,
        email: invitation.email,
        token,
      };
    } else {
      const workspace = await this._workspaceRepo.findById(
        invitation.workspaceId.toString(),
      );

      if (!workspace) {
        throw new NotFoundException(INVITE_MESSAGE.NOT_FOUND);
      }

      workspace.members.push({
        user: existingUser._id,
        role: invitation.role as 'owner' | 'member',
        joinedAt: new Date(),
      });

      await this._workspaceRepo.updateById(workspace._id.toString(), {
        members: workspace.members,
      });

      await this._invitationRepo.updateById(invitation._id.toString(), {
        status: 'accepted',
      });

      const accessToken = this._jwtService.signAccessToken({
        userId: existingUser._id.toString(),
        email: existingUser.email,
      });

      return {
        accessToken,
        user: {
          id: existingUser._id.toString(),
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
        },
      };
    }
  }

  async completeProfile(
    token: string,
    dto: CompleteProfileDto,
  ): Promise<AcceptInvitationResponseDto> {
    this._logger.log(`profile completion started`);
    const invitation = await this._invitationRepo.findByToken(token);
    if (!invitation) {
      throw new NotFoundException(INVITE_MESSAGE.INVALID);
    }
    if (invitation.status !== 'pending') {
      throw new BadRequestException(INVITE_MESSAGE.CONFLICT);
    }
    const hashedPassword = await this._hashingService.hashPassword(
      dto.password,
    );
    const newUser = await this._userRepo.create({
      email: invitation.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hashedPassword,
    });
    this._logger.log(`New user created: ${newUser.email}`);
    const workspace = await this._workspaceRepo.findById(
      invitation.workspaceId.toString(),
    );

    if (!workspace) {
      throw new NotFoundException(INVITE_MESSAGE.NOT_FOUND);
    }
    workspace.members.push({
      user: newUser._id,
      role: invitation.role as 'owner' | 'member',
      joinedAt: new Date(),
    });

    await this._workspaceRepo.updateById(workspace._id.toString(), {
      members: workspace.members,
    });

    await this._invitationRepo.updateById(invitation._id.toString(), {
      status: 'accepted',
    });

    const accessToken = this._jwtService.signAccessToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    return {
      accessToken,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    };
  }
}
