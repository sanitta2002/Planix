import {
  IDashboardMetrics,
  IMetricCard,
  IRevenueByPlan,
  ISubscriptionTrend,
  IDetailedBreakdown,
} from '../interface/dashboard-metrics.interface';

export class MetricCardDto implements IMetricCard {
  value: number;
  growthPercent?: number;
  changeCount?: number;
}

export class RevenueByPlanDto implements IRevenueByPlan {
  month: string;
  basic: number;
  pro: number;
  enterprise: number;
  [key: string]: string | number;
}

export class SubscriptionTrendDto implements ISubscriptionTrend {
  month: string;
  active: number;
}

export class DetailedBreakdownDto implements IDetailedBreakdown {
  planName: string;
  revenue: number;
  subscriptions: number;
  contribution: number;
}

export class DashboardMetricsDto implements IDashboardMetrics {
  metrics: {
    totalRevenue: MetricCardDto;
    activeSubscriptions: MetricCardDto;
    cancellations: MetricCardDto;
    activeWorkspaces: MetricCardDto;
  };
  revenueByPlan: RevenueByPlanDto[];
  subscriptionTrend: SubscriptionTrendDto[];
  detailedBreakdown: DetailedBreakdownDto[];
}
