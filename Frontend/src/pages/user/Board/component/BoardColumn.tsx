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
      className={`flex flex-col min-w-[320px] max-w-[380px] w-full h-full bg-secondary/10 rounded-2xl border transition-colors duration-200 backdrop-blur-sm overflow-hidden ${isOver ? 'border-primary/50 bg-primary/5' : 'border-border/40'}`}
    >
      {/* Column Header */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {title}
          </h2>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary/50 text-[10px] font-bold text-muted-foreground border border-border/50">
            {count}
          </span>
        </div>
        
        {/* Accent Underline */}
        <div className={`h-0.5 w-full rounded-full opacity-60 ${color}`} />
      </div>

      {/* Column Content */}
      <div className="flex-1 px-3 pb-4 overflow-y-auto scrollbar-hide">
        <SortableContext items={issues.map(i => (i.id || i._id)!)} strategy={verticalListSortingStrategy}>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              {/* Custom Dashed Box Icon */}
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/30 rounded-xl" />
                <div className="absolute inset-4 border-2 border-dashed border-muted-foreground/20 rounded-lg opacity-50" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">No issues</h3>
              <p className="text-[11px] text-muted-foreground/60 mt-1 max-w-[160px]">
                Drag issues here or create a new one.
              </p>
            </div>
          ) : (
            <div className="flex flex-col min-h-[150px]">
              {children}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;

