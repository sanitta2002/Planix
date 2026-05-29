import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardMetrics } from "../../Service/admin/adminService";
import {
  DollarSign,
  Users,
  XCircle,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────
interface MetricCard {
  value: number;
  growthPercent?: number;
  changeCount?: number;
}

interface RevenueByPlan {
  month: string;
  basic: number;
  pro: number;
  enterprise: number;
}

interface SubscriptionTrend {
  month: string;
  active: number;
}

interface DetailedBreakdown {
  planName: string;
  revenue: number;
  subscriptions: number;
  contribution: number;
}

interface DashboardData {
  metrics: {
    totalRevenue: MetricCard;
    activeSubscriptions: MetricCard;
    cancellations: MetricCard;
    activeWorkspaces: MetricCard;
  };
  revenueByPlan: RevenueByPlan[];
  subscriptionTrend: SubscriptionTrend[];
  detailedBreakdown: DetailedBreakdown[];
}

// ─── Format helpers ─────────────────────────────────────────
const formatCurrency = (val: number) =>
  "$" + val.toLocaleString("en-US");

const formatNumber = (val: number) =>
  val.toLocaleString("en-US");

// ─── Custom SVG Bar Chart ───────────────────────────────────
const RevenueBarChart = ({ data }: { data: RevenueByPlan[] }) => {
  const width = 500;
  const height = 280;
  const paddingLeft = 60;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Find max
  const maxVal = Math.max(
    ...data.map((d) => d.basic + d.pro + d.enterprise)
  );
  const yMax = Math.ceil(maxVal / 10000) * 10000 || 80000;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const barGroupWidth = chartW / data.length;
  const barWidth = barGroupWidth * 0.22;
  const barGap = 4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="barBasic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="barPro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="barEnterprise" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {yTicks.map((tick, i) => {
        const y = paddingTop + chartH - (tick / yMax) * chartH;
        return (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="#1e293b"
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 8}
              y={y + 4}
              textAnchor="end"
              fill="#64748b"
              fontSize={11}
            >
              {tick >= 1000 ? `${tick / 1000}k` : tick}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const groupX = paddingLeft + i * barGroupWidth + barGroupWidth * 0.15;
        const bH = (d.basic / yMax) * chartH;
        const pH = (d.pro / yMax) * chartH;
        const eH = (d.enterprise / yMax) * chartH;
        const baseY = paddingTop + chartH;

        return (
          <g key={i}>
            {/* Basic */}
            <rect
              x={groupX}
              y={baseY - bH}
              width={barWidth}
              height={bH}
              rx={3}
              fill="url(#barBasic)"
              className="transition-all duration-300 hover:opacity-80"
            >
              <title>
                {d.month} Basic: {formatCurrency(d.basic)}
              </title>
            </rect>
            {/* Pro */}
            <rect
              x={groupX + barWidth + barGap}
              y={baseY - pH}
              width={barWidth}
              height={pH}
              rx={3}
              fill="url(#barPro)"
              className="transition-all duration-300 hover:opacity-80"
            >
              <title>
                {d.month} Pro: {formatCurrency(d.pro)}
              </title>
            </rect>
            {/* Enterprise */}
            <rect
              x={groupX + (barWidth + barGap) * 2}
              y={baseY - eH}
              width={barWidth}
              height={eH}
              rx={3}
              fill="url(#barEnterprise)"
              className="transition-all duration-300 hover:opacity-80"
            >
              <title>
                {d.month} Enterprise: {formatCurrency(d.enterprise)}
              </title>
            </rect>
            {/* Month label */}
            <text
              x={groupX + (barWidth * 3 + barGap * 2) / 2}
              y={baseY + 20}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={12}
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Custom SVG Line Chart ──────────────────────────────────
const SubscriptionLineChart = ({ data }: { data: SubscriptionTrend[] }) => {
  const width = 500;
  const height = 280;
  const paddingLeft = 50;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingRight = 20;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.active));
  const yMax = Math.ceil(maxVal / 100) * 100 || 600;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  // Compute points
  const points = data.map((d, i) => ({
    x: paddingLeft + (i / (data.length - 1)) * chartW,
    y: paddingTop + chartH - (d.active / yMax) * chartH,
    value: d.active,
    month: d.month,
  }));

  // Build smooth curve (simple catmull-rom → cubic bezier approximation)
  const pathData = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  // Area fill
  const areaPath =
    pathData +
    ` L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gridlines */}
      {yTicks.map((tick, i) => {
        const y = paddingTop + chartH - (tick / yMax) * chartH;
        return (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="#1e293b"
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 8}
              y={y + 4}
              textAnchor="end"
              fill="#64748b"
              fontSize={11}
            >
              {tick}
            </text>
          </g>
        );
      })}

      {/* X-axis month labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={paddingTop + chartH + 22}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={12}
        >
          {p.month}
        </text>
      ))}

      {/* Area */}
      <path d={areaPath} fill="url(#areaFill)" />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth={3}
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={5}
            fill="#7c3aed"
            stroke="#a855f7"
            strokeWidth={2}
            className="transition-all duration-200 hover:r-[7]"
          >
            <title>
              {p.month}: {p.value}
            </title>
          </circle>
        </g>
      ))}
    </svg>
  );
};

// ─── Skeleton Loader ────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-6 animate-pulse">
    <div className="h-4 w-24 bg-slate-700/50 rounded mb-4" />
    <div className="h-8 w-32 bg-slate-700/50 rounded mb-2" />
    <div className="h-3 w-20 bg-slate-700/50 rounded" />
  </div>
);

// ─── Main Page ──────────────────────────────────────────────
const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useQuery<{ data: DashboardData }>({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: getAdminDashboardMetrics,
    select: (res: { data: DashboardData }) => res,
  });

  const dashboard = data?.data;

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-lg text-slate-300">Failed to load dashboard data</p>
          <p className="text-sm text-slate-500 mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="min-h-full p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Overview of key metrics and performance
          </p>
        </div>

        {/* Metric Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {/* Total Revenue */}
            <div className="group relative rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">Total Revenue</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {formatCurrency(dashboard.metrics.totalRevenue.value)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                {(dashboard.metrics.totalRevenue.growthPercent ?? 0) >= 0 ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">
                      +{dashboard.metrics.totalRevenue.growthPercent}% from last month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400">
                      {dashboard.metrics.totalRevenue.growthPercent}% from last month
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="group relative rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">Active Subscriptions</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {formatNumber(dashboard.metrics.activeSubscriptions.value)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  +{dashboard.metrics.activeSubscriptions.changeCount} this month
                </span>
              </div>
            </div>

            {/* Cancellations */}
            <div className="group relative rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 transition-all duration-300 hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">Cancellations</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10">
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {formatNumber(dashboard.metrics.cancellations.value)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                {(dashboard.metrics.cancellations.changeCount ?? 0) <= 0 ? (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">
                      {dashboard.metrics.cancellations.changeCount} from last month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-red-400">
                      +{dashboard.metrics.cancellations.changeCount} from last month
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Active Workspaces */}
            <div className="group relative rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">Active Workspaces</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {formatNumber(dashboard.metrics.activeWorkspaces.value)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  +{dashboard.metrics.activeWorkspaces.changeCount} this month
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Charts */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-6 h-[350px] animate-pulse"
              >
                <div className="h-5 w-40 bg-slate-700/50 rounded mb-6" />
                <div className="h-[260px] bg-slate-800/30 rounded" />
              </div>
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue by Plan Chart */}
            <div className="rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Revenue by Plan</h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span className="text-slate-400">Basic</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                    <span className="text-slate-400">Pro</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                    <span className="text-slate-400">Enterprise</span>
                  </span>
                </div>
              </div>
              <div className="h-[260px]">
                <RevenueBarChart data={dashboard.revenueByPlan} />
              </div>
            </div>

            {/* Subscription Trend Chart */}
            <div className="rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Subscription Trend
              </h2>
              <div className="h-[260px]">
                <SubscriptionLineChart data={dashboard.subscriptionTrend} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Detailed Breakdown Table */}
        {isLoading ? (
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-6 animate-pulse">
            <div className="h-5 w-44 bg-slate-700/50 rounded mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-800/30 rounded mb-3" />
            ))}
          </div>
        ) : dashboard ? (
          <div className="rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white mb-5">
              Detailed Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      Plan Name
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      Revenue
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      Subscriptions
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">
                      Contribution %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.detailedBreakdown.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800/30 transition-colors hover:bg-slate-800/20"
                    >
                      <td className="py-3.5 px-4 text-white font-medium">
                        {row.planName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {formatCurrency(row.revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {formatNumber(row.subscriptions)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                              style={{ width: `${row.contribution}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs font-medium">
                            {row.contribution}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center mt-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

