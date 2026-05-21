import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Kanban,
  Folder,
  RotateCw,
  Play,
  Layers,
  Bug,
  BookOpen
} from "lucide-react";
import type { RootState } from "../../../store/Store";
import { useGetUserDashboard } from "../../../hooks/dashboard/dashboardHook";
import ProjectModal from "../../../components/modal/ProjectModal";
import { FRONTEND_ROUTES } from "../../../constants/frontRoutes";

const DashboardPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const { data: dashboardResponse, isLoading, isError, refetch } = useGetUserDashboard(
    currentProject?.id || ""
  );

  const data = dashboardResponse?.data;

  // Render "No project selected" if there is no active project
  if (!currentProject) {
    return (
      <div className="h-full min-h-[85vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 relative overflow-hidden bg-[#0B1120]">
        {/* Background Glow */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[130px]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-12 flex flex-col items-center text-center shadow-2xl">
          {/* Icon Container */}
          <div className="w-20 h-20 bg-background/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 relative">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl animate-pulse" />
            <TrendingUp className="w-10 h-10 text-blue-500 relative z-10" />
          </div>

          {/* Text Content */}
          <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">No project selected</h2>
          <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
            Select a project from the top navigation menu or create a brand new one to explore real-time velocity analytics, issue distributions, and member work logs.
          </p>

          {/* Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/30 active:scale-95 cursor-pointer"
          >
            Create Project
          </button>
        </div>

        <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  // Render Premium Skeleton while loading
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1120] text-foreground p-6 md:p-10 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-secondary/50 rounded-xl" />
            <div className="h-4 w-96 bg-secondary/30 rounded-lg" />
          </div>
          <div className="h-10 w-28 bg-secondary/40 rounded-xl" />
        </div>

        {/* KPIs Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-secondary/20 rounded-2xl border border-border/20 p-6" />
          ))}
        </div>

        {/* Dynamic content grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-secondary/20 rounded-3xl border border-border/20" />
            <div className="h-96 bg-secondary/20 rounded-3xl border border-border/20" />
          </div>
          <div className="space-y-8">
            <div className="h-96 bg-secondary/20 rounded-3xl border border-border/20" />
            <div className="h-64 bg-secondary/20 rounded-3xl border border-border/20" />
          </div>
        </div>
      </div>
    );
  }

  // Render Beautiful Error Dashboard State
  if (isError || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] bg-[#0B1120] text-foreground p-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-inner">
          <AlertCircle className="w-10 h-10 text-red-500 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black mb-3 tracking-tight">Failed to Load Dashboard</h2>
        <p className="text-muted-foreground text-sm max-w-sm text-center mb-8 leading-relaxed">
          An error occurred while compiling your dynamic project data. Make sure your services and database connections are live and retry.
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md border border-border/50 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    projectHeader,
    metrics,
    overallProgress,
    myProgress,
    timeSpentByTeam,
    topPerformer,
    issuesByType,
    issueStatusDistribution,
    currentSprint,
    epicsOverview
  } = data;

  // Custom visual components calculations
  const myProgressCircumference = 2 * Math.PI * 34; // r = 34
  const myProgressStrokeDashoffset =
    myProgressCircumference - (myProgress.percentage / 100) * myProgressCircumference;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120] text-foreground p-6 md:p-10 space-y-10 selection:bg-primary/20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/25 rounded-full text-xs font-semibold text-blue-400 tracking-wider uppercase">
              {projectHeader.key}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
                projectHeader.status === "On Track"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : projectHeader.status === "In Progress"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-400"
              }`}
            >
              {projectHeader.status}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {projectHeader.projectName}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl md:max-w-2xl leading-relaxed">
            {projectHeader.description || "No description provided for this project."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-secondary/15 border border-border/40 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {projectHeader.owner.name.charAt(0)}
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Project Owner
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              {projectHeader.owner.name}
            </div>
          </div>
        </div>
      </div>

      {/* --- KPI METRIC CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Card 1: Total Issues */}
        <div className="group bg-secondary/10 hover:bg-secondary/15 border border-border/30 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-300" />
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/10 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-[11px] font-bold text-blue-400/80 bg-blue-500/5 px-2.5 py-0.5 rounded-full">
              Real-time
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{metrics.totalIssues}</div>
          <div className="text-muted-foreground text-sm font-medium mt-1">Total Issues Logs</div>
        </div>

        {/* Card 2: Completed Issues */}
        <div className="group bg-secondary/10 hover:bg-secondary/15 border border-border/30 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-[11px] font-bold text-emerald-400/80 bg-emerald-500/5 px-2.5 py-0.5 rounded-full">
              {metrics.completedPercentage}% Rate
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{metrics.completedIssues}</div>
          <div className="text-muted-foreground text-sm font-medium mt-1">Resolved Tasks</div>
        </div>

        {/* Card 3: Active Sprints */}
        <div className="group bg-secondary/10 hover:bg-secondary/15 border border-border/30 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-300" />
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/10 group-hover:scale-110 transition-transform duration-300">
              <Kanban className="w-6 h-6 text-purple-400" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{metrics.activeSprints}</div>
          <div className="text-muted-foreground text-sm font-medium mt-1">Running Sprints</div>
        </div>

        {/* Card 4: Open Epics */}
        <div className="group bg-secondary/10 hover:bg-secondary/15 border border-border/30 hover:border-amber-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300" />
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/10 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-[11px] font-bold text-amber-400/80 bg-amber-500/5 px-2.5 py-0.5 rounded-full">
              Epics Count
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{metrics.openEpics}</div>
          <div className="text-muted-foreground text-sm font-medium mt-1">Underway Epics</div>
        </div>
      </div>

      {/* --- CORE DOUBLE COLUMN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* --- LEFT HAND SPAN (2 COLUMNS): AGILE VELOCITY & PROGRESS --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Overall Project Progress */}
          <div className="bg-secondary/10 border border-border/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Overall Project Progress</h3>
                <p className="text-muted-foreground text-xs mt-0.5">Project timeline milestones progress</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">{overallProgress.percentage}%</span>
                <span className="text-xs text-muted-foreground block">of issues closed</span>
              </div>
            </div>
            
            {/* Elegant glowing horizontal progress bar */}
            <div className="w-full bg-background/50 h-4 rounded-full overflow-hidden border border-white/5 relative p-0.5 shadow-inner mb-6">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 relative"
                style={{ width: `${overallProgress.percentage}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-shimmer" />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50 animate-ping" />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-background/30 px-4 py-3 rounded-xl border border-white/5 text-sm text-muted-foreground leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{overallProgress.description}</span>
            </div>
          </div>

          {/* Section: Sprint & Work Breakdown */}
          {currentSprint ? (
            <div className="bg-secondary/10 border border-border/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-xl font-bold text-white">{currentSprint.sprintName}</h3>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{currentSprint.startDate} – {currentSprint.endDate}</span>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/25 px-4 py-2 rounded-xl text-center">
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Remaining</div>
                  <div className="text-lg font-black text-white">{currentSprint.daysRemaining} Days</div>
                </div>
              </div>

              {/* Status Breakdown Mini Pills */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">Sprint Completion</span>
                  <span className="font-black text-indigo-400">{currentSprint.percentage}%</span>
                </div>
                <div className="w-full bg-background/50 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${currentSprint.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Resolved {currentSprint.completedCount} out of {currentSprint.totalCount} sprint issues.
                </div>
              </div>

              {/* Grid: Status and Issue Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-background/30 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-xs text-muted-foreground font-semibold">TO DO</div>
                  <div className="text-xl font-black text-white mt-1">{currentSprint.statusBreakdown.todo}</div>
                </div>
                <div className="bg-background/30 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-xs text-amber-400/80 font-semibold">IN PROGRESS</div>
                  <div className="text-xl font-black text-white mt-1">{currentSprint.statusBreakdown.inProgress}</div>
                </div>
                <div className="bg-background/30 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-xs text-rose-400/80 font-semibold">REVIEW</div>
                  <div className="text-xl font-black text-white mt-1">{currentSprint.statusBreakdown.review}</div>
                </div>
                <div className="bg-background/30 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-xs text-emerald-400/80 font-semibold">DONE</div>
                  <div className="text-xl font-black text-white mt-1">{currentSprint.statusBreakdown.done}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/10 border border-border/30 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-background/50 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                <AlertCircle className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No Running Sprints</h3>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
                There are no active or future sprints scheduled in the project pipeline. Make sure you start a sprint in the Backlog view.
              </p>
              <button
                onClick={() => navigate(FRONTEND_ROUTES.BACKLOG)}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 border border-border/50 text-foreground text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Go to Backlog
              </button>
            </div>
          )}

          {/* Section: Epics Overview */}
          <div className="bg-secondary/10 border border-border/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Epics Performance</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Progress profiles of high-level roadmap epics</p>
            </div>

            {epicsOverview.length > 0 ? (
              <div className="space-y-4">
                {epicsOverview.map((epic) => (
                  <div
                    key={epic.id}
                    className="p-4 bg-background/30 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-colors hover:bg-background/40"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="font-bold text-white text-sm truncate block">{epic.title}</span>
                      </div>
                      <div className="w-full bg-background/50 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${epic.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-sm font-black text-white">{epic.completedIssues}/{epic.totalIssues}</span>
                        <span className="text-[10px] text-muted-foreground block">Issues resolved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {epic.percentage}%
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            epic.status === "On Track"
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                              : epic.status === "In Progress"
                              ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                              : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                          }`}
                        >
                          {epic.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/40 rounded-2xl bg-background/20">
                Create roadmap issues of type "EPIC" to view high-level project progress profiles here.
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT HAND SPAN (1 COLUMN): WORK LOGS, PERSONAL METRICS & MVP --- */}
        <div className="space-y-8">
          
          {/* Section: My Personalized Progress */}
          <div className="bg-gradient-to-br from-indigo-950/20 to-blue-950/20 border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">My Progress</h3>
                <p className="text-muted-foreground text-xs mt-0.5">Personal dashboard metrics</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="34"
                    className="stroke-background/50 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="34"
                    className="stroke-blue-500 fill-none transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={myProgressCircumference}
                    strokeDashoffset={myProgressStrokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-white">{myProgress.percentage}%</span>
                  <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-widest">Rate</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs uppercase shadow-md overflow-hidden relative">
                    {myProgress.avatar && (myProgress.avatar.startsWith("http") || myProgress.avatar.startsWith("https") || myProgress.avatar.startsWith("data:") || myProgress.avatar.startsWith("/")) ? (
                      <img 
                        src={myProgress.avatar} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.avatar-fallback')) {
                            const fallback = document.createElement('span');
                            fallback.className = 'avatar-fallback';
                            fallback.innerText = (myProgress.name || "ME").charAt(0).toUpperCase();
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      (myProgress.name || "ME").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white truncate max-w-[120px]">{myProgress.name}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {myProgress.role}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground leading-normal">
                  Completed {myProgress.issuesCompleted} out of {myProgress.totalIssuesAssigned} issues.
                </div>
              </div>
            </div>

            {/* Remaining Hours Profile */}
            <div className="bg-background/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">Remaining Hours</span>
              </div>
              <span className="text-lg font-black text-amber-400">{myProgress.remainingHours} hrs</span>
            </div>
          </div>

          {/* Section: Top Performer (MVP) */}
          {topPerformer && (
            <div className="bg-gradient-to-br from-amber-950/20 to-yellow-950/10 border border-amber-500/25 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Top Performer</h3>
                </div>
                <span className="text-[9px] font-black tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase">
                  MVP
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg relative border border-amber-400/20 overflow-hidden">
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                  {topPerformer.avatar && (topPerformer.avatar.startsWith("http") || topPerformer.avatar.startsWith("https") || topPerformer.avatar.startsWith("data:") || topPerformer.avatar.startsWith("/")) ? (
                    <img 
                      src={topPerformer.avatar} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.avatar-fallback')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'avatar-fallback';
                          fallback.innerText = (topPerformer.name || "MVP").charAt(0).toUpperCase();
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    (topPerformer.name || "MVP").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">{topPerformer.name}</h4>
                  <p className="text-xs text-amber-400 font-semibold">{topPerformer.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/40 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Tasks Closed
                  </div>
                  <div className="text-xl font-black text-white mt-1">{topPerformer.issuesCompleted}</div>
                </div>
                <div className="bg-background/40 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Avg Cycle Time
                  </div>
                  <div className="text-xl font-black text-amber-400 mt-1">{topPerformer.avgCycleTime}d</div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Agile Issue Distribution */}
          <div className="bg-secondary/10 border border-border/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Issue Composition</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Frequency profiles by issue type</p>
            </div>

            <div className="space-y-4">
              {/* Epic Item */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/15">
                    <Folder className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-bold text-white/80">Epics</span>
                </div>
                <span className="font-black text-white">{issuesByType.epic}</span>
              </div>

              {/* Story Item */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-bold text-white/80">User Stories</span>
                </div>
                <span className="font-black text-white">{issuesByType.story}</span>
              </div>

              {/* Task Item */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/15">
                    <Layers className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="font-bold text-white/80">Standard Tasks</span>
                </div>
                <span className="font-black text-white">{issuesByType.task}</span>
              </div>

              {/* Bug Item */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/15">
                    <Bug className="w-4 h-4 text-rose-400" />
                  </div>
                  <span className="font-bold text-white/80">Defects / Bugs</span>
                </div>
                <span className="font-black text-white">{issuesByType.bug}</span>
              </div>
            </div>
          </div>

          {/* Section: Team Activity Leaderboard */}
          <div className="bg-secondary/10 border border-border/30 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-md space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">Team Activity Logs</h3>
              <p className="text-muted-foreground text-xs mt-0.5">Aggregated time and velocity leaderboard</p>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {timeSpentByTeam.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background/20 rounded-xl border border-white/5 hover:bg-background/35 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm overflow-hidden">
                      {member.avatar && (member.avatar.startsWith("http") || member.avatar.startsWith("https") || member.avatar.startsWith("data:") || member.avatar.startsWith("/")) ? (
                        <img 
                          src={member.avatar} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.avatar-fallback')) {
                              const fallback = document.createElement('span');
                              fallback.className = 'avatar-fallback';
                              fallback.innerText = (member.name || "M").charAt(0).toUpperCase();
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        (member.name || "M").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[120px]">{member.name}</div>
                      <div className="text-[10px] text-muted-foreground">{member.role}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-400 block">{member.hours} hrs</span>
                    <span className="text-[9px] text-muted-foreground block">{member.issuesCompleted} issues closed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
