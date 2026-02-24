import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import type { IPaymentService } from '../interface/IPaymentService';
import type { ISubscriptionPlanService } from 'src/subscription/interface/ISubscriptionPlanService';
import { CreateCheckoutDto } from '../dto/createCheckout.dto';
import { ApiResponse } from 'src/common/utils/api-response.util';
import { SUBSCRIPTION_MESSAGE } from 'src/common/constants/messages.constant';
import type { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('IPaymentService') private readonly paymentService: IPaymentService,
    @Inject('ISubscriptionPlanService')
    private readonly subscriptionPlanService: ISubscriptionPlanService,
  ) {}
  @Post('checkout')
  async checkout(@Body() dto: CreateCheckoutDto) {
    const plan = await this.subscriptionPlanService.getPlanById(dto.planId);
    const sessions = await this.paymentService.createCheckoutSession(
      plan,
      dto.subscriptionId,
    );
    return { url: sessions.url as string };
  }
  @Post('confirm')
  async confirm(@Body() body: { sessionId: string }) {
    const data = await this.paymentService.confirmPayment(body.sessionId);
    return ApiResponse.success(
      HttpStatus.OK,
      SUBSCRIPTION_MESSAGE.SUBSCRIPTION_SUCCESS,
      data,
    );
  }
  @Post('webhook')
  handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(req, signature);
  }
}
