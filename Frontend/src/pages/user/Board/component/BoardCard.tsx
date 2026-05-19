import React from 'react';
import { Clock, Square, CheckSquare, Bookmark, AlertCircle } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ExtendedIssue } from '../../../../types/BacklogTypes';
import { IssueStatus } from '../../../../types/IssueType';

interface BoardCardProps {
  issue: ExtendedIssue;
  onClick?: (issue: ExtendedIssue) => void;
  members?: any[];
}

const BoardCard: React.FC<BoardCardProps> = ({ issue, onClick, members }) => {
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
        return { icon: <AlertCircle className="w-3 h-3" />, bg: 'bg-red-500/15 text-red-400 border-red-500/20', label: 'Bug' };
      case 'story':
        return { icon: <Bookmark className="w-3 h-3" />, bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Story' };
      case 'task':
        return { icon: <CheckSquare className="w-3 h-3" />, bg: 'bg-purple-500/15 text-purple-400 border-purple-500/20', label: 'Task' };
      default:
        return { icon: <Square className="w-3 h-3" />, bg: 'bg-slate-500/15 text-slate-400 border-slate-500/20', label: type || 'Issue' };
    }
  };

  const { icon: typeIcon, bg: typeBg, label: typeLabel } = getTypeConfig(issue.issueType || issue.type);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case IssueStatus.TODO:
        return {
          container: 'border-blue-500/10 bg-blue-500/[0.03] hover:border-blue-500/30',
          accent: 'bg-blue-500'
        };
      case IssueStatus.IN_PROGRESS:
        return {
          container: 'border-amber-500/10 bg-amber-500/[0.03] hover:border-amber-500/30',
          accent: 'bg-amber-500'
        };
      case IssueStatus.DONE:
        return {
          container: 'border-emerald-500/10 bg-emerald-500/[0.03] hover:border-emerald-500/30 opacity-75 hover:opacity-100',
          accent: 'bg-emerald-500'
        };
      case IssueStatus.BLOCKED:
        return {
          container: 'border-red-500/10 bg-red-500/[0.03] hover:border-red-500/30',
          accent: 'bg-red-500'
        };
      default:
        return {
          container: 'border-white/5 bg-white/[0.02] hover:border-white/10',
          accent: 'bg-gray-500'
        };
    }
  };

  const { container: containerStyles, accent: statusAccentColor } = getStatusStyles(issue.status);

  // Find assignee profile details in project members
  const assignee = members?.find(m => m.user.id === issue.assigneeId)?.user;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative border rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 overflow-hidden hover:shadow-lg hover:shadow-black/10 ${containerStyles}`}
      onClick={() => onClick?.(issue)}
    >
      {/* Accent Line */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-300 ${statusAccentColor} opacity-60 group-hover:opacity-100`} />

      <div className="flex flex-col gap-2.5 ml-2.5 pointer-events-none">
        {/* Top Row: Epic + Type Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {issue.parentTitle && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 truncate max-w-[140px]">
              {issue.parentTitle}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${typeBg}`}>
            {typeIcon}
            {typeLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-medium text-slate-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
          {issue.title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2.5 text-[10px] text-slate-500">
            <span className="font-semibold text-slate-400">{issue.key}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{issue.progress || '0'}h</span>
            </div>
          </div>

          {/* Assignee Avatar */}
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shadow-sm">
            {issue.assigneeId ? (
              assignee?.avatarUrl ? (
                <img
                  src={assignee.avatarUrl}
                  alt={assignee.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[9px] uppercase">
                  {assignee?.firstName?.charAt(0) || '?'}
                </div>
              )
            ) : (
              <div className="text-[9px] text-slate-500 font-bold">?</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
