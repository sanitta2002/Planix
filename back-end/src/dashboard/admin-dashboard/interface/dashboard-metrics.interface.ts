import { Types } from 'mongoose';

export interface IMetricCard {
  value: number;
  growthPercent?: number;
  changeCount?: number;
}

export interface IRevenueByPlan {
  month: string;
  basic: number;
  pro: number;
  enterprise: number;
  [key: string]: string | number; // For dynamic plan names
}

export interface ISubscriptionTrend {
  month: string;
  active: number;
}

export interface IDetailedBreakdown {
  planName: string;
  revenue: number;
  subscriptions: number;
  contribution: number;
}

export interface IDashboardMetrics {
  metrics: {
    totalRevenue: IMetricCard;
    activeSubscriptions: IMetricCard;
    cancellations: IMetricCard;
    activeWorkspaces: IMetricCard;
  };
  revenueByPlan: IRevenueByPlan[];
  subscriptionTrend: ISubscriptionTrend[];
  detailedBreakdown: IDetailedBreakdown[];
}

export interface IPopulatedPlan {
  _id: Types.ObjectId;
  name: string;
  price: number;
}
