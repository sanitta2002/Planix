import { Inject, Injectable } from '@nestjs/common';
import { IPaymentService } from '../interface/IPaymentService';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { IPlan } from '../interface/IPlan';
import { PAYMENT_MESSAGE } from 'src/common/constants/messages.constant';
import { error } from 'console';
import type { ISubscriptionService } from 'src/subscription/interface/ISubscriptionService';
import { Request } from 'express';

@Injectable()
export class PaymentService implements IPaymentService {
  private stripe: Stripe;
  constructor(
    private configService: ConfigService,
    @Inject('ISubscriptionService')
    private readonly subscriptionService: ISubscriptionService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {},
    );
  }
  async createCheckoutSession(
    plan: IPlan,
    subscriptionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: plan.name },
            unit_amount: Math.ceil(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { subscriptionId },
      success_url: `${this.configService.get('FRONTEND_URL')}/payment-success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/payment-cancel`,
    });
  }
  async confirmPayment(sessionId: string): Promise<void> {
    const sessions = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (sessions.payment_status !== 'paid') {
      throw new Error(PAYMENT_MESSAGE.NOT_COMPLETED);
    }
    const subscriptionId = sessions.metadata?.subscriptionId;
    if (!subscriptionId) {
      throw new error(PAYMENT_MESSAGE.MISSING_DATA);
    }
  }

  async handleWebhook(
    req: Request,
    signature: string,
  ): Promise<{ received: boolean }> {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.body as Buffer,
        signature,
        endpointSecret!,
      );
    } catch (error) {
      console.log(error);
      return { received: false };
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const subscriptionId = session.metadata?.subscriptionId;
      if (subscriptionId) {
        await this.subscriptionService.makeactivateSubscription(subscriptionId);
      }
    }
    return { received: true };
  }
}
