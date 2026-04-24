import React, { useState } from "react";
import { ArrowLeft, ChevronDown, CheckCircle2, AlertCircle, PartyPopper } from "lucide-react";
import { Button } from "../ui/Button";
import type { ISprint } from "../../types/Sprint";
import type { IssueData } from "../../types/BacklogTypes";

interface CompleteSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (moveToSprintId?: string) => void;
  sprint: ISprint;
  issues: IssueData[];
  plannedSprints: ISprint[];
  isLoading?: boolean;
}

const CompleteSprintModal: React.FC<CompleteSprintModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  sprint,
  issues,
  plannedSprints,
  isLoading = false,
}) => {
  const [moveToSprintId, setMoveToSprintId] = useState<string>("backlog");

  if (!isOpen) return null;

  const completedIssues = issues.filter((issue) => issue.status === "DONE");
  const incompleteIssues = issues.filter((issue) => issue.status !== "DONE");
  const isAllCompleted = incompleteIssues.length === 0;

  const handleComplete = () => {
    onComplete(moveToSprintId === "backlog" ? undefined : moveToSprintId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-[580px] bg-[#0A0E17] border border-white/10 rounded-[28px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-5 px-8 pt-8 pb-6">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Complete Sprint</h2>
            <p className="text-zinc-500 text-sm font-medium mt-0.5">{sprint.name}</p>
          </div>
        </div>

        <div className="px-8 pb-10 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Completed */}
            <div className="bg-[#0D131F] border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
              <div className="relative z-10">
                <span className="text-[11px] font-bold text-emerald-500 tracking-[0.1em] uppercase">Completed</span>
                <div className="text-4xl font-bold text-white mt-2 mb-1">{completedIssues.length}</div>
                <span className="text-zinc-500 text-sm">issues finished</span>
              </div>
            </div>

            {/* Incomplete */}
            <div className="bg-[#0D131F] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <AlertCircle className="w-16 h-16 text-zinc-400" />
              </div>
              <div className="relative z-10">
                <span className="text-[11px] font-bold text-zinc-400 tracking-[0.1em] uppercase">Incomplete</span>
                <div className="text-4xl font-bold text-white mt-2 mb-1">{incompleteIssues.length}</div>
                <span className="text-zinc-500 text-sm">issues remaining</span>
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          <div className={`flex items-center gap-4 p-5 rounded-2xl border ${isAllCompleted 
              ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" 
              : "bg-amber-500/5 border-amber-500/10 text-amber-500"
            }`}>
            <div className={`p-2 rounded-xl ${isAllCompleted ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
              {isAllCompleted ? <PartyPopper className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <p className="text-[13.5px] font-medium leading-normal">
              {isAllCompleted 
                ? "Excellent work! All issues in this sprint are completed. You're ready to close it."
                : "This sprint has pending issues. Please select another sprint or the backlog to move them."}
            </p>
          </div>

          {/* Migration Selector */}
          {!isAllCompleted && (
            <div className="space-y-3">
              <label className="text-[13px] font-semibold text-zinc-400 pl-1">
                Move incomplete issues to
              </label>
              <div className="relative group">
                <select
                  value={moveToSprintId}
                  onChange={(e) => setMoveToSprintId(e.target.value)}
                  className="w-full bg-[#0D131F] border border-white/5 rounded-xl px-5 py-4 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                >
                  <option value="backlog">Backlog</option>
                  {plannedSprints
                    .filter(s => s._id !== sprint._id)
                    .map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none transition-transform group-hover:translate-y-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-8 py-8 bg-[#0D131F]/50 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 px-8 rounded-xl h-11"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 px-10 rounded-full text-sm font-bold h-11 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:scale-100 min-w-[160px]"
          >
            {isLoading ? "Completing..." : "Complete Sprint"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompleteSprintModal;
