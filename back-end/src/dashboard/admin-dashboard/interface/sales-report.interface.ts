export interface IRevenueTimeline {
  week: string;
  revenue: number;
}

export interface IMonthlyRecurringRevenue {
  month: string;
  revenue: number;
}

export interface ISubscriptionGrowth {
  plan: string;
  subscriptions: number;
}

export interface IRecentPayment {
  id: string;
  user: string;
  workspace: string;
  amount: number;
  status: string;
  date: string;
}

export interface ISalesReport {
  revenueTimeline: IRevenueTimeline[];
  monthlyRecurringRevenue: IMonthlyRecurringRevenue[];
  subscriptionGrowth: ISubscriptionGrowth[];
  recentPayments: IRecentPayment[];
}
