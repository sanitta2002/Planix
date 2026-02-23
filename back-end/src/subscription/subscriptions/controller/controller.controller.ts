import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { ISubscriptionService } from 'src/subscription/interface/ISubscriptionService';
import { CreateSubscriptionDto } from '../dto/CreateSubscriptionDto';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { SUBSCRIPTION_MESSAGE } from 'src/common/constants/messages.constant';
import type { ISubscriptionPlanService } from 'src/subscription/interface/ISubscriptionPlanService';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    userId: string;
    email?: string;
  };
}

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @Inject('ISubscriptionService')
    private readonly subscriptionService: ISubscriptionService,
    @Inject('ISubscriptionPlanService')
    private readonly subplanservice: ISubscriptionPlanService,
  ) {}

  @Get('plans')
  async getAllActivePlan() {
    const plan = await this.subplanservice.getActivePlans();
    return ApiResponse.success(
      HttpStatus.OK,
      SUBSCRIPTION_MESSAGE.ALLACTIVEPLAN,
      plan,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSubscription(
    @Req() req: AuthRequest,
    @Body() dto: CreateSubscriptionDto,
  ) {
    console.log('work', dto.workspaceId);
    console.log('planid', dto.planId);

    const userId: string = req.user.userId;

    const subscription = await this.subscriptionService.createSubscription(
      userId,
      dto,
    );
    return ApiResponse.success(
      HttpStatus.CREATED,
      SUBSCRIPTION_MESSAGE.SUBSCRIPTION_SUCCESS,
      subscription,
    );
  }
}
