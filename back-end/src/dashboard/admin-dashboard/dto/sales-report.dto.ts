import {
  ISalesReport,
  IRevenueTimeline,
  IMonthlyRecurringRevenue,
  ISubscriptionGrowth,
  IRecentPayment,
} from '../interface/sales-report.interface';

export class RevenueTimelineDto implements IRevenueTimeline {
  week: string;
  revenue: number;
}

export class MonthlyRecurringRevenueDto implements IMonthlyRecurringRevenue {
  month: string;
  revenue: number;
}

export class SubscriptionGrowthDto implements ISubscriptionGrowth {
  plan: string;
  subscriptions: number;
}

export class RecentPaymentDto implements IRecentPayment {
  id: string;
  user: string;
  workspace: string;
  amount: number;
  status: string;
  date: string;
}

export class SalesReportDto implements ISalesReport {
  revenueTimeline: RevenueTimelineDto[];
  monthlyRecurringRevenue: MonthlyRecurringRevenueDto[];
  subscriptionGrowth: SubscriptionGrowthDto[];
  recentPayments: RecentPaymentDto[];
}
