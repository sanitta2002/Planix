import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import { Invitation, InvitationDocument } from '../model/invitation.schema';
import { IInvitationRepository } from '../interface/IInvitationRepository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class InvitationRepository
  extends BaseRepository<InvitationDocument>
  implements IInvitationRepository
{
  constructor(
    @InjectModel(Invitation.name)
    private readonly _invitationModel: Model<InvitationDocument>,
  ) {
    super(_invitationModel);
  }
  async findByToken(token: string): Promise<InvitationDocument | null> {
    return await this._invitationModel.findOne({ token });
  }
  async findPending(
    workspaceId: string,
    email: string,
  ): Promise<InvitationDocument | null> {
    return await this._invitationModel.findOne({
      workspaceId,
      email,
      status: 'pending',
    });
  }
  async updateStatus(invitationId: string, status: string) {
    return this._invitationModel.findByIdAndUpdate(
      invitationId,
      { status },
      { new: true },
    );
  }
}
