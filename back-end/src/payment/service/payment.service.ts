import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaymentService } from '../interface/IPaymentService';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { IPlan } from '../interface/IPlan';
import { PAYMENT_MESSAGE } from 'src/common/constants/messages.constant';
import { error } from 'console';
import type { ISubscriptionService } from 'src/subscription/interface/ISubscriptionService';
import { Request } from 'express';
import type { ISubscriptionRepository } from 'src/subscription/interface/ISubscriptionRepository';
import {
  SubscriptionDocument,
  SubscriptionStatus,
} from 'src/subscription/Model/subscription.schema';
import type { ISubscriptionPlanRepository } from 'src/subscription/interface/ISubscriptionPlanRepository';
import { PaymentDto } from '../dto/PaymentDto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PaymentService implements IPaymentService {
  private stripe: Stripe;
  constructor(
    private readonly _logger: PinoLogger,
    private _configService: ConfigService,
    @Inject('ISubscriptionService')
    private readonly subscriptionService: ISubscriptionService,
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepo: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly planRepo: ISubscriptionPlanRepository,
  ) {
    this.stripe = new Stripe(
      this._configService.get<string>('STRIPE_SECRET_KEY')!,
      {},
    );
  }
  async createCheckoutSession(
    plan: IPlan,
    subscriptionId: string,
    workspaceId: string,
  ): Promise<Stripe.Checkout.Session> {
    this._logger.info(`create stripe checkout session: ${subscriptionId}`);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: plan.name },
            unit_amount: Math.ceil(plan.price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { subscriptionId, workspaceId },
      success_url: `${this._configService.get('FRONTEND_URL')}/payment-success`,
      cancel_url: `${this._configService.get('FRONTEND_URL')}/payment-cancel`,
    });
    this._logger.info(`stripe session create: ${session.id}`);
    return session;
  }
  async confirmPayment(sessionId: string): Promise<void> {
    this._logger.info(`confirming stripe: ${sessionId}`);
    const sessions = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (sessions.payment_status !== 'paid') {
      throw new Error(PAYMENT_MESSAGE.NOT_COMPLETED);
    }
    const subscriptionId = sessions.metadata?.subscriptionId;
    if (!subscriptionId) {
      throw new error(PAYMENT_MESSAGE.MISSING_DATA);
    }
    this._logger.info(`payment confirmed: ${subscriptionId}`);
  }

  async handleWebhook(
    req: Request,
    signature: string,
  ): Promise<{ received: boolean }> {
    const endpointSecret = this._configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.body as Buffer,
        signature,
        endpointSecret!,
      );
      this._logger.info(`stripe webhook receive: ${event.type}`);
    } catch (error) {
      console.log(error);
      return { received: false };
    }
    if (event.type === 'checkout.session.completed') {
      console.log('event', event);

      const session = event.data.object;

      this._logger.info(`checkout completed: ${session.id}`);

      const subscriptionId = session.metadata?.subscriptionId;
      console.log(subscriptionId + 'subscription id');
      const stripeSubscriptionId = session.subscription as string;

      if (subscriptionId) {
        console.log('updating subscription');
        await this.subscriptionService.makeactivateSubscription(
          subscriptionId,
          stripeSubscriptionId,
        );
      }
    }
    return { received: true };
  }
  async retryPayment(subscriptionId: string): Promise<{ url: string | null }> {
    this._logger.info(`Retry payment for subscription: ${subscriptionId}`);

    const subscription = await this.subscriptionRepo.findById(subscriptionId);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Subscription already active');
    }

    const plan = await this.planRepo.findById(subscription.planId.toString());

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',

      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: plan.name,
            },
            unit_amount: Math.ceil(plan.price * 100),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],

      success_url: `${this._configService.get('FRONTEND_URL')}/payment-success`,
      cancel_url: `${this._configService.get('FRONTEND_URL')}/payment-cancel`,

      metadata: {
        subscriptionId: subscription._id.toString(),
      },
    });

    return { url: session.url };
  }
  async getAllPayments(
    planId?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    page?: number,
    limit?: number,
  ): Promise<{ payments: PaymentDto[]; total: number }> {
    const {
      payments,
      total,
    }: { payments: SubscriptionDocument[]; total: number } =
      await this.subscriptionRepo.findAllPayments(
        planId,
        startDate,
        endDate,
        status,
        page,
        limit,
      );

    const mappedPayments = (payments || []).map((sub) => {
      const user = sub.userId as unknown as { email: string };
      const plan = sub.planId as unknown as { name: string; price: number };

      return {
        id: sub._id.toString(),
        user: user?.email,
        plan: plan?.name,
        amount: plan?.price,
        status: sub.status,
        startDate: sub.startDate,
      };
    });

    return { payments: mappedPayments, total };
  }
}
