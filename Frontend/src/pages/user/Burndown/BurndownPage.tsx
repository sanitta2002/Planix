import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  TrendingDown,
  AlertCircle,
  Calendar,
  BarChart3,
  Clock,
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import type { RootState } from "../../../store/Store";
import { useGetSprintsByProject, useGetSprintBurndown } from "../../../hooks/sprint/sprintHook";
import { FRONTEND_ROUTES } from "../../../constants/frontRoutes";
import type { ISprint } from "../../../types/Sprint";

type ViewMode = "points" | "hours";

const BurndownPage: React.FC = () => {
  const navigate = useNavigate();

  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const { data: sprintsResponse, isLoading: isSprintsLoading } = useGetSprintsByProject(
    currentProject?.id || ""
  );
  
  const sprints = sprintsResponse?.data || [];

  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("points");

  useEffect(() => {
    if (sprints && sprints.length > 0 && !selectedSprintId) {
      const activeSprint = sprints.find((s: ISprint) => s.status === "ACTIVE");
      if (activeSprint) {
        setSelectedSprintId(activeSprint._id);
      } else {
        setSelectedSprintId(sprints[0]._id);
      }
    }
  }, [sprints, selectedSprintId]);

  const { data: burndownData, isLoading: isBurndownLoading, isError } = useGetSprintBurndown(selectedSprintId);

  // --- Empty / Loading States ---

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#0B1120] text-foreground p-6">
        <div className="w-20 h-20 bg-background/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5">
          <TrendingDown className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-3">No project selected</h2>
        <p className="text-muted-foreground text-base max-w-md text-center mb-8 leading-relaxed">
          Select a project from the top navigation menu to view its sprint burndown charts.
        </p>
      </div>
    );
  }

  if (isSprintsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1120] p-6 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-secondary/50 rounded-xl" />
        <div className="h-[400px] bg-secondary/20 rounded-3xl border border-border/20" />
      </div>
    );
  }

  if (!sprints || sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] bg-[#0B1120] p-6 text-foreground">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mb-6 border border-border/30">
          <Calendar className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Sprints Found</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          There are no sprints available for this project. Create a sprint in the Backlog to view burndown data.
        </p>
        <button
          onClick={() => navigate(FRONTEND_ROUTES.BACKLOG)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          Go to Backlog
        </button>
      </div>
    );
  }

  // --- Handlers ---

  const handleSprintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprintId(e.target.value);
  };

  // --- Derived data for the selected view mode ---

  const isPointsView = viewMode === "points";

  const barData = burndownData ? [
    { 
      name: "Total", 
      value: isPointsView ? burndownData.totalPoints : burndownData.totalHours 
    },
    { 
      name: "Completed", 
      value: isPointsView ? burndownData.completedPoints : burndownData.completedHours 
    },
    { 
      name: "Remaining", 
      value: isPointsView ? burndownData.remainingPoints : burndownData.remainingHours 
    },
  ] : [];

  const trendData = burndownData?.trendData || [];

  const idealKey = isPointsView ? "idealPoints" : "idealHours";
  const actualKey = isPointsView ? "actualPoints" : "actualHours";
  const unitLabel = isPointsView ? "Story Points" : "Estimated Hours";

  // --- Tooltip ---

  interface TooltipPayload {
    color?: string;
    name?: string;
    value?: string | number;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A2234] border border-slate-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 mt-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-400 text-xs">{entry.name}</span>
              </div>
              <span className="text-white font-bold text-sm">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Completion percentage ---
  const total = isPointsView ? (burndownData?.totalPoints || 0) : (burndownData?.totalHours || 0);
  const completed = isPointsView ? (burndownData?.completedPoints || 0) : (burndownData?.completedHours || 0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120] text-foreground p-6 md:p-10 space-y-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-800/50 pb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-white flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-blue-500" />
            Sprint Burndown
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Track remaining work and see if your team is on pace to finish the sprint.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-[#1A2234] border border-slate-800/50 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("points")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                viewMode === "points"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 size={16} />
              Story Points
            </button>
            <button
              onClick={() => setViewMode("hours")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                viewMode === "hours"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Clock size={16} />
              Hours
            </button>
          </div>

          {/* Sprint Selector */}
          <div className="bg-[#1A2234] border border-slate-800/50 px-4 py-2 rounded-xl">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5 block">
              Sprint
            </label>
            <select
              value={selectedSprintId}
              onChange={handleSprintChange}
              className="bg-transparent text-white font-semibold outline-none border-none cursor-pointer pr-4 w-full appearance-none text-sm"
            >
              {sprints.map((sprint: ISprint) => (
                <option key={sprint._id} value={sprint._id} className="bg-[#0B1120] text-white">
                  {sprint.name} {sprint.status === "ACTIVE" ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isBurndownLoading ? (
        <div className="h-64 bg-[#1A2234]/50 rounded-3xl border border-slate-800/20 animate-pulse relative z-10" />
      ) : isError || !burndownData ? (
        <div className="bg-[#1A2234]/50 border border-red-500/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative z-10">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white">Data Unavailable</h3>
          <p className="text-slate-400 text-sm max-w-sm mt-2">Could not load burndown data for this sprint.</p>
        </div>
      ) : (
        <div className="space-y-10 relative z-10">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1A2234] border border-slate-800/50 rounded-2xl p-5">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total {unitLabel}</p>
              <p className="text-3xl font-extrabold text-white">{total}</p>
            </div>
            <div className="bg-[#1A2234] border border-slate-800/50 rounded-2xl p-5">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Completed</p>
              <p className="text-3xl font-extrabold text-emerald-400">{completed}</p>
            </div>
            <div className="bg-[#1A2234] border border-slate-800/50 rounded-2xl p-5">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Progress</p>
              <p className="text-3xl font-extrabold text-white">{percentage}%</p>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Summary Bar Chart */}
          <section className="bg-[#1A2234]/60 border border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Sprint Summary</h2>
              <p className="text-slate-400 text-sm">
                Overview of Total vs Completed vs Remaining {unitLabel.toLowerCase()}.
              </p>
            </div>
            
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 13 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 13 }} 
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    label={{ value: unitLabel, angle: -90, position: 'insideLeft', offset: 5, fill: '#64748b', fontSize: 13 }}
                  />
                  <RechartsTooltip cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    name={unitLabel}
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    barSize={80}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Trend Line Chart */}
          <section className="bg-[#1A2234]/60 border border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-1">Sprint Burndown Trend</h2>
              <p className="text-slate-400 text-sm">
                Tracking remaining {unitLabel.toLowerCase()} over sprint dates.
              </p>
            </div>
            
            {/* Legend Explainer */}
            <div className="flex items-center gap-6 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-slate-500 border-dashed border-t-2 border-slate-500" />
                <span className="text-slate-400">Where you should be (Goal)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-blue-500" />
                <span className="text-slate-400">Where you actually are</span>
              </div>
            </div>

            {trendData.length > 0 ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                      label={{ value: 'Sprint Dates', position: 'insideBottom', offset: -18, fill: '#64748b', fontSize: 13 }}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                      label={{ value: unitLabel, angle: -90, position: 'insideLeft', offset: -5, fill: '#64748b', fontSize: 13 }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    
                    {/* Ideal / Goal line */}
                    <Line 
                      name="Goal (Ideal Pace)"
                      type="linear" 
                      dataKey={idealKey} 
                      stroke="#475569" 
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={false}
                      activeDot={false}
                    />
                    
                    {/* Actual progress line */}
                    <Line 
                      name="Actual Progress"
                      type="stepAfter" 
                      dataKey={actualKey} 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0B1120", stroke: "#3b82f6", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#3b82f6", stroke: "#0B1120", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] border border-dashed border-slate-800/40 rounded-xl flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <Calendar className="w-8 h-8 text-slate-600" />
                <p>Sprint has no start/end dates set yet.</p>
                <p className="text-xs text-slate-600">Start the sprint from the Backlog to see the burndown trend.</p>
              </div>
            )}
          </section>
          
        </div>
      )}
    </div>
  );
};

export default BurndownPage;
