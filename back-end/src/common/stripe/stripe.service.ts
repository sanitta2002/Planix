import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private _stripe: Stripe;
  constructor(private _configService: ConfigService) {
    this._stripe = new Stripe(
      this._configService.get<string>('STRIPE_SECRET_KEY')!,
      {},
    );
  }
  async getInvoice(invoiceId: string) {
    const invoice = await this._stripe.invoices.retrieve(invoiceId, {
      expand: ['payment_intent'],
    });
    return {
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      invoiceUrl: invoice.hosted_invoice_url,
      nextPayment: invoice.next_payment_attempt,
    };
  }
}
