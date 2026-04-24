import React from 'react';
import { Clock, Square, CheckSquare, Bookmark, AlertCircle } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ExtendedIssue } from '../../../../types/BacklogTypes';
import { IssueStatus } from '../../../../types/IssueType';


interface BoardCardProps {
  issue: ExtendedIssue;
  onClick?: (issue: ExtendedIssue) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ issue, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: (issue.id || issue._id)!,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
    position: 'relative',
    zIndex: isDragging ? 50 : undefined,
  };

  // Map issue types to icons and colors
  const getTypeConfig = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'bug':
        return { icon: <AlertCircle className="w-3 h-3 text-red-500" />, color: 'bg-amber-500', label: 'Bug' };
      case 'story':
        return { icon: <Bookmark className="w-3 h-3 text-green-500" />, color: 'bg-green-500', label: 'Story' };
      case 'task':
        return { icon: <CheckSquare className="w-3 h-3 text-blue-500" />, color: 'bg-rose-500', label: 'Task' };
      default:
        return { icon: <Square className="w-3 h-3 text-gray-400" />, color: 'bg-gray-500', label: type || 'Issue' };
    }
  };

  const { label: typeLabel } = getTypeConfig(issue.issueType || issue.type);


  const getStatusStyles = (status: string) => {
    switch (status) {
      case IssueStatus.TODO:
        return {
          container: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/50',
          accent: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
        };
      case IssueStatus.IN_PROGRESS:
        return {
          container: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50',
          accent: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
        };
      case IssueStatus.DONE:
        return {
          container: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/50 opacity-80 hover:opacity-100',
          accent: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
        };
      default:
        return {
          container: 'border-border/50 bg-secondary/30 hover:border-primary/50',
          accent: 'bg-gray-500'
        };
    }
  };

  const { container: containerStyles, accent: statusAccentColor } = getStatusStyles(issue.status);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative border rounded-xl p-4 mb-3 cursor-grab active:cursor-grabbing transition-all duration-300 card-hover overflow-hidden ${containerStyles}`}
      onClick={() => onClick?.(issue)}
    >
      {/* Accent Line */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-colors duration-300 ${statusAccentColor}`} />

      <div className="flex flex-col gap-3 ml-2 pointer-events-none">
        {/* Parent/Epic Pill */}
        {issue.parentTitle && (
          <div className="flex">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              {issue.parentTitle}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
          {issue.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {/* Key */}
            <span className="font-medium">{issue.key}</span>

            {/* Estimate */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{issue.progress || '8'}</span>
            </div>

            {/* Type Label */}
            <span>{typeLabel}</span>
          </div>

          {/* Assignee Avatar */}
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
            {issue.assigneeId ? (
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${issue.assigneeId}`} 
                alt="Assignee" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-[10px] text-primary font-bold">?</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;

