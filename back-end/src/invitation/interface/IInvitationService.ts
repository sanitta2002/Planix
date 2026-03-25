import { InvitationResponseDto } from '../dto/res/InvitationResponseDto';
import { InviteMemberDto } from '../dto/req/InviteMemberDto';
import { AcceptInvitationResponseDto } from '../dto/res/AcceptInvitationResponseDto';
import { CompleteProfileDto } from '../dto/req/CompleteProfileDto';

export interface IInvitationService {
  inviteMember(
    workspaceId: string,
    dto: InviteMemberDto,
    currentUserId: string,
  ): Promise<InvitationResponseDto>;
  acceptInvitation(token: string): Promise<AcceptInvitationResponseDto>;
  completeProfile(
    token: string,
    dto: CompleteProfileDto,
  ): Promise<AcceptInvitationResponseDto>;
}
