import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { IssueData, ExtendedIssue } from '../../../../types/BacklogTypes';

interface BoardColumnProps {
  title: string;
  status: string;
  count: number;
  color: string;
  issues: (IssueData | ExtendedIssue)[];
  children: React.ReactNode;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ title, status, count, color, issues, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const isEmpty = issues.length === 0;

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-0 rounded-2xl border transition-all duration-300 overflow-hidden bg-[#0f1729] ${
        isOver 
          ? 'border-primary/40 shadow-[0_0_30px_rgba(99,102,241,0.08)]' 
          : 'border-white/[0.06]'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 pb-3 flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
            <h2 className="text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase">
              {title}
            </h2>
          </div>
          <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md bg-white/[0.05] text-[10px] font-bold text-slate-500 border border-white/[0.06]">
            {count}
          </span>
        </div>
        
        {/* Accent Line */}
        <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent overflow-hidden">
          <div className={`h-full rounded-full opacity-70 ${color}`} style={{ width: `${Math.min(count * 20, 100)}%` }} />
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 px-2.5 pb-3 overflow-y-auto scrollbar-hide">
        <SortableContext items={issues.map(i => (i.id || i._id)!)} strategy={verticalListSortingStrategy}>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-12 h-12 mb-3 opacity-30">
                <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-xl" />
                <div className="absolute inset-3 border border-dashed border-slate-700 rounded-lg" />
              </div>
              <h3 className="text-xs font-semibold text-slate-500">No issues</h3>
              <p className="text-[10px] text-slate-600 mt-1 max-w-[140px] leading-relaxed">
                Drag issues here or create new ones
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 min-h-[120px]">
              {children}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
