import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '@/users/interfaces/user.repository.interface';
import type { IWorkspaceRepository } from '@/workspace/interface/IWorkspaceRepository';
import type { ISubscriptionRepository } from '@/subscription/interface/ISubscriptionRepository';
import type { ISubscriptionPlanRepository } from '@/subscription/interface/ISubscriptionPlanRepository';
import { SubscriptionStatus } from '@/subscription/Model/subscription.schema';
import { IPopulatedPlan } from '../interface/dashboard-metrics.interface';
import { DashboardMetricsDto } from '../dto/dashboard-metrics.dto';
import { SalesReportDto } from '../dto/sales-report.dto';

@Injectable()
export class AdminDashboardService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IWorkspaceRepository')
    private readonly _workspaceRepository: IWorkspaceRepository,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const { workspaces: allWorkspaces } =
      await this._workspaceRepository.findAllWorkspace();
    const plans = await this._subscriptionPlanRepository.findAll();

    const { payments: subscriptions } =
      await this._subscriptionRepository.findAllPayments();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let totalRevenue = 0;
    let revenueThisMonth = 0;
    let revenueLastMonth = 0;

    let activeSubscriptions = 0;
    let activeThisMonth = 0;

    let cancellations = 0;
    let cancellationsThisMonth = 0;
    let cancellationsLastMonth = 0;

    const planStats = new Map<string, { revenue: number; count: number }>();
    plans.forEach((plan) => {
      planStats.set(plan.name.toLowerCase(), { revenue: 0, count: 0 });
    });

    const monthlyRevenue = new Map<
      string,
      { basic: number; pro: number; enterprise: number }
    >();
    const monthlySubCount = new Map<string, number>();

    const dynamicMonthLabels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      dynamicMonthLabels.push(d.toLocaleString('default', { month: 'short' }));
    }

    dynamicMonthLabels.forEach((m) => {
      monthlyRevenue.set(m, { basic: 0, pro: 0, enterprise: 0 });
      monthlySubCount.set(m, 0);
    });

    subscriptions.forEach((sub) => {
      const plan = sub.planId as unknown as IPopulatedPlan;
      if (!plan || !plan.name) return;

      const planName = plan.name.toLowerCase();
      const planPrice = Number(plan.price) || 0;
      const subDate = new Date(sub.startDate || now);
      const monthLabel = subDate.toLocaleString('default', { month: 'short' });

      if (!planStats.has(planName)) {
        planStats.set(planName, { revenue: 0, count: 0 });
      }

      if (
        sub.status === SubscriptionStatus.ACTIVE ||
        sub.status === SubscriptionStatus.CANCELLED
      ) {
        totalRevenue += planPrice;

        const stats = planStats.get(planName)!;
        stats.revenue += planPrice;
        stats.count += 1;
        planStats.set(planName, stats);

        if (subDate >= thirtyDaysAgo) revenueThisMonth += planPrice;
        else if (subDate >= sixtyDaysAgo) revenueLastMonth += planPrice;

        if (monthlyRevenue.has(monthLabel)) {
          const monthData = monthlyRevenue.get(monthLabel)!;
          if (planName.includes('basic')) monthData.basic += planPrice;
          else if (planName.includes('pro')) monthData.pro += planPrice;
          else monthData.enterprise += planPrice;
        }
      }

      if (sub.status === SubscriptionStatus.ACTIVE) {
        activeSubscriptions += 1;
        if (subDate >= thirtyDaysAgo) activeThisMonth += 1;
        if (monthlySubCount.has(monthLabel)) {
          monthlySubCount.set(monthLabel, monthlySubCount.get(monthLabel)! + 1);
        }
      }

      if (sub.status === SubscriptionStatus.CANCELLED) {
        cancellations += 1;
        const cancelDate = sub.cancelledAt
          ? new Date(sub.cancelledAt)
          : subDate;
        if (cancelDate >= thirtyDaysAgo) cancellationsThisMonth += 1;
        else if (cancelDate >= sixtyDaysAgo) cancellationsLastMonth += 1;
      }
    });

    const activeWorkspaces = allWorkspaces.filter((ws) => !ws.isDeleted).length;
    let workspacesThisMonth = 0;
    allWorkspaces.forEach((ws) => {
      const wsDate = new Date(ws.createdAt || now);
      if (wsDate >= thirtyDaysAgo && !ws.isDeleted) workspacesThisMonth += 1;
    });

    let revenueGrowthPercent = 0;
    if (revenueLastMonth > 0) {
      revenueGrowthPercent = Number(
        (
          ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) *
          100
        ).toFixed(1),
      );
    } else if (revenueThisMonth > 0) {
      revenueGrowthPercent = 100;
    }

    const cancelChange = cancellationsThisMonth - cancellationsLastMonth;
    const revenueByPlan = dynamicMonthLabels.map((month) => {
      const dbData = monthlyRevenue.get(month)!;
      return {
        month,
        basic: dbData.basic,
        pro: dbData.pro,
        enterprise: dbData.enterprise,
      };
    });

    let runningTotal = 0;
    const subscriptionTrend = dynamicMonthLabels.map((month) => {
      const dbCount = monthlySubCount.get(month) || 0;
      runningTotal += dbCount;
      return {
        month,
        active: runningTotal,
      };
    });

    const detailedBreakdown = Array.from(planStats.entries()).map(
      ([name, data]) => {
        const contribution =
          totalRevenue > 0
            ? Number(((data.revenue / totalRevenue) * 100).toFixed(1))
            : 0;
        return {
          planName: name.charAt(0).toUpperCase() + name.slice(1),
          revenue: data.revenue,
          subscriptions: data.count,
          contribution,
        };
      },
    );

    return {
      metrics: {
        totalRevenue: {
          value: totalRevenue,
          growthPercent: revenueGrowthPercent,
        },
        activeSubscriptions: {
          value: activeSubscriptions,
          changeCount: activeThisMonth,
        },
        cancellations: { value: cancellations, changeCount: cancelChange },
        activeWorkspaces: {
          value: activeWorkspaces,
          changeCount: workspacesThisMonth,
        },
      },
      revenueByPlan,
      subscriptionTrend,
      detailedBreakdown,
    };
  }

  async getSalesReportData(): Promise<SalesReportDto> {
    const { workspaces: allWorkspaces } =
      await this._workspaceRepository.findAllWorkspace();
    const plans = await this._subscriptionPlanRepository.findAll();
    const { payments: subscriptions } =
      await this._subscriptionRepository.findAllPayments();

    const now = new Date();

    const revenueTimelineMap = new Map<string, number>();
    ['Week 1', 'Week 2', 'Week 3', 'Week 4'].forEach((w) =>
      revenueTimelineMap.set(w, 0),
    );

    const mrrMap = new Map<string, number>();
    const dynamicMonthLabels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      dynamicMonthLabels.push(d.toLocaleString('default', { month: 'short' }));
    }
    dynamicMonthLabels.forEach((m) => mrrMap.set(m, 0));

    const subGrowthMap = new Map<string, number>();
    plans.forEach((plan) => subGrowthMap.set(plan.name.toLowerCase(), 0));

    subscriptions.forEach((sub) => {
      const plan = sub.planId as unknown as IPopulatedPlan;
      if (!plan || !plan.name) return;

      const planName = plan.name.toLowerCase();
      const planPrice = Number(plan.price) || 0;
      const subDate = new Date(sub.startDate || now);
      const monthLabel = subDate.toLocaleString('default', { month: 'short' });

      if (sub.status === SubscriptionStatus.ACTIVE) {
        if (!subGrowthMap.has(planName)) subGrowthMap.set(planName, 0);
        subGrowthMap.set(planName, subGrowthMap.get(planName)! + 1);
      }

      if (
        sub.status === SubscriptionStatus.ACTIVE ||
        sub.status === SubscriptionStatus.CANCELLED
      ) {
        if (mrrMap.has(monthLabel)) {
          mrrMap.set(monthLabel, mrrMap.get(monthLabel)! + planPrice);
        }

        if (
          subDate.getMonth() === now.getMonth() &&
          subDate.getFullYear() === now.getFullYear()
        ) {
          const dayOfMonth = subDate.getDate();
          let week = 'Week 4';
          if (dayOfMonth <= 7) week = 'Week 1';
          else if (dayOfMonth <= 14) week = 'Week 2';
          else if (dayOfMonth <= 21) week = 'Week 3';

          revenueTimelineMap.set(
            week,
            revenueTimelineMap.get(week)! + planPrice,
          );
        }
      }
    });

    const recentPayments = subscriptions.slice(0, 10).map((sub) => {
      const user = sub.userId as unknown as { name?: string; email?: string };
      const plan = sub.planId as unknown as IPopulatedPlan;

      const workspace = allWorkspaces.find(
        (ws) => ws._id.toString() === sub.workspaceId.toString(),
      );

      return {
        id: sub._id.toString(),
        user: user?.name || user?.email || 'Unknown User',
        workspace: workspace ? workspace.name : 'Unknown Workspace',
        amount: Number(plan?.price) || 0,
        status: sub.status,
        date: new Date(sub.startDate || now).toISOString().split('T')[0],
      };
    });

    return {
      revenueTimeline: Array.from(revenueTimelineMap.entries()).map(
        ([week, revenue]) => ({ week, revenue }),
      ),
      monthlyRecurringRevenue: dynamicMonthLabels.map((month) => ({
        month,
        revenue: mrrMap.get(month)!,
      })),
      subscriptionGrowth: Array.from(subGrowthMap.entries()).map(
        ([plan, subscriptions]) => ({
          plan: plan.charAt(0).toUpperCase() + plan.slice(1),
          subscriptions,
        }),
      ),
      recentPayments,
    };
  }
}
