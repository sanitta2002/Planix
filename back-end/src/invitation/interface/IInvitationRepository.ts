import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';
import { InvitationDocument } from '../model/invitation.schema';

export interface IInvitationRepository extends IBaseRepository<InvitationDocument> {
  findByToken(token: string): Promise<InvitationDocument | null>;
  findPending(
    workspaceId: string,
    email: string,
  ): Promise<InvitationDocument | null>;
  updateStatus(
    invitationId: string,
    status: string,
  ): Promise<InvitationDocument | null>;
}
