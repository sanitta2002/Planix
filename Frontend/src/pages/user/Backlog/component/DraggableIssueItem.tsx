
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal } from "lucide-react";
import type { IssueData } from "../../../../types/BacklogTypes";
import { IssueType } from "../../../../types/IssueType";

interface DraggableIssueItemProps {
  issue: IssueData;
  onClick: (issue: IssueData) => void;
}

function DraggableIssueItem({ issue, onClick }: DraggableIssueItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id || issue._id || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIssueTypeStyle = (type: string = "") => {
    const t = type.toUpperCase();
    if (t === IssueType.BUG) return "bg-red-500/20 text-red-500 border-red-500/30";
    if (t === IssueType.STORY) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (t === IssueType.TASK) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  const getIssueTypeInitial = (type: string = "") => {
    const t = type.toUpperCase();
    if (t === IssueType.BUG) return "B";
    if (t === IssueType.STORY) return "S";
    if (t === IssueType.TASK) return "T";
    return "I";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes} 
      {...listeners} 
      className={`group flex items-center gap-3 bg-[#111827] hover:bg-[#1A2234] p-3 border-b border-slate-800/50 transition-colors cursor-grab active:cursor-grabbing ${isDragging ? 'z-50 shadow-2xl ring-1 ring-blue-500/50' : ''}`}
      onClick={() => onClick(issue)}
    >
      <div className="text-slate-600 group-hover:text-slate-400">
        <GripVertical size={18} />
      </div>

      <div className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold border ${getIssueTypeStyle(issue.issueType || issue.type)}`}>
        {getIssueTypeInitial(issue.issueType || issue.type)}
      </div>

      <span className="text-xs font-medium text-slate-500 min-w-[60px]">
        {issue.key}
      </span>

      <span className="flex-1 text-sm text-slate-300 group-hover:text-white truncate">
        {issue.title}
      </span>

      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
          issue.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          issue.status === 'IN_PROGRESS' || issue.status === 'IN PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {issue.status?.replace('_', ' ').toUpperCase() || 'TODO'}
        </span>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle more options
          }}
          className="p-1 text-slate-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

export default DraggableIssueItem;
