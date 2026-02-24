import Stripe from 'stripe';
import { IPlan } from './IPlan';
import { Request } from 'express';

export interface IPaymentService {
  createCheckoutSession(
    plan: IPlan,
    subscriptionId: string,
  ): Promise<Stripe.Checkout.Session>;
  confirmPayment(sessionId: string): Promise<void>;
  handleWebhook(
    req: Request,
    signature: string,
  ): Promise<{ received: boolean }>;
}
