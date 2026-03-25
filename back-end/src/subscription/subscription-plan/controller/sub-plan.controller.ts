import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { ISubscriptionPlanService } from 'src/subscription/interface/ISubscriptionPlanService';
import { CreatePlanDto } from '../dto/req/createplan.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { SUBSCRIPTION_MESSAGE } from 'src/common/constants/messages.constant';
import { UpdatePlanDto } from '../dto/req/UpdatePlanDto';

@UseGuards(RolesGuard)
@Role('admin')
@Controller('admin/subscriptionPlan')
export class SubPlanController {
  constructor(
    @Inject('ISubscriptionPlanService')
    private readonly subscriptionPlanService: ISubscriptionPlanService,
  ) {}
  @Post()
  async createPlan(@Body() data: CreatePlanDto) {
    const plan = await this.subscriptionPlanService.createPlan(data);
    return ApiResponse.success(
      HttpStatus.CREATED,
      SUBSCRIPTION_MESSAGE.SUBSCRIPTION_SUCCESS,
      plan,
    );
  }
  @Get()
  async getAllPlans() {
    const plan = await this.subscriptionPlanService.getAllPlans();
    return ApiResponse.success(
      HttpStatus.OK,
      SUBSCRIPTION_MESSAGE.SUBSCRIPTION_FETCH,
      plan,
    );
  }
  @Patch(':planId')
  async updatePlan(
    @Param('planId') planId: string,
    @Body() data: UpdatePlanDto,
  ) {
    const updatePlan = await this.subscriptionPlanService.updatePlan(
      planId,
      data,
    );
    return ApiResponse.success(
      HttpStatus.OK,
      SUBSCRIPTION_MESSAGE.SUBSCRIPTION_UPDATE,
      updatePlan,
    );
  }
  @Delete(':planId')
  async deletePlan(@Param('planId') planId: string) {
    await this.subscriptionPlanService.deletePlan(planId);
    return ApiResponse.success(
      HttpStatus.OK,
      SUBSCRIPTION_MESSAGE.SUBSCRIPTION_DELETE,
    );
  }
}
