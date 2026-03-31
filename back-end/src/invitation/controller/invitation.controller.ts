import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { IInvitationService } from '../interface/IInvitationService';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InviteMemberDto } from '../dto/req/InviteMemberDto';
import { InvitationResponseDto } from '../dto/res/InvitationResponseDto';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { INVITE_MESSAGE } from 'src/common/constants/messages.constant';
import type { Request } from 'express';
import { CompleteProfileDto } from '../dto/req/CompleteProfileDto';
import { SubscriptionGuardGuard } from 'src/guard/subscription-guard/subscription-guard.guard';
interface AuthRequest extends Request {
  user: {
    userId: string;
  };
}

@Controller('invitation')
export class InvitationController {
  constructor(
    @Inject('IInvitationService')
    private readonly _invitationService: IInvitationService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @UseGuards(SubscriptionGuardGuard)
  @Post(':workspaceId')
  async inviteMember(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: InviteMemberDto,
    @Req() req: AuthRequest,
  ): Promise<InvitationResponseDto> {
    const currentUserId = req.user.userId;
    const invite = await this._invitationService.inviteMember(
      workspaceId,
      dto,
      currentUserId,
    );
    return ApiResponse.success(HttpStatus.OK, INVITE_MESSAGE.SUCCESS, invite);
  }
  @Post('accept/:token')
  async acceptInvitation(@Param('token') token: string) {
    const invitation = await this._invitationService.acceptInvitation(token);
    return ApiResponse.success(
      HttpStatus.OK,
      INVITE_MESSAGE.SUCCESS,
      invitation,
    );
  }
  @Post('complete/:token')
  async completeProfile(
    @Param('token') token: string,
    @Body() dto: CompleteProfileDto,
  ) {
    const userDatils = await this._invitationService.completeProfile(
      token,
      dto,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      INVITE_MESSAGE.SUCCESS,
      userDatils,
    );
  }
}
