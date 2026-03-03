import { Types } from 'mongoose';

export class InvitationMapper {
  static toPersistence(
    workspaceId: string,
    email: string,
    name: string,
    invitedBy: Types.ObjectId,
    token: string,
  ) {
    return {
      workspaceId: new Types.ObjectId(workspaceId),
      email,
      name,
      role: 'member' as const,
      token,
      invitedBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }
  static toResponse(workspaceId: string) {
    return {
      message: 'Invitation accepted',
      workspaceId,
      role: 'member',
    };
  }
}
