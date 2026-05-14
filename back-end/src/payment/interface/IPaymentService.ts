import Stripe from 'stripe';
import { IPlan } from './IPlan';
import { Request } from 'express';
import { PaymentDto } from '../dto/PaymentDto';

export interface IPaymentService {
  createCheckoutSession(
    plan: IPlan,
    subscriptionId: string,
    workspaceId: string,
  ): Promise<Stripe.Checkout.Session>;
  confirmPayment(sessionId: string): Promise<void>;
  handleWebhook(
    req: Request,
    signature: string,
  ): Promise<{ received: boolean }>;
  retryPayment(subscriptionId: string): Promise<{ url: string | null }>;
  getAllPayments(
    planId?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    page?: number,
    limit?: number,
  ): Promise<{ payments: PaymentDto[]; total: number }>;
}
