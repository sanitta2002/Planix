import { InvitationResponseDto } from '@/invitation/dto/res/InvitationResponseDto';
import { InviteMemberDto } from '@/invitation/dto/req/InviteMemberDto';
import { AcceptInvitationResponseDto } from '@/invitation/dto/res/AcceptInvitationResponseDto';
import { CompleteProfileDto } from '@/invitation/dto/req/CompleteProfileDto';

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
