import { useState } from "react";
import { ChevronUp, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { IssueData } from "../../../../types/BacklogTypes";
import DraggableIssueItem from "./DraggableIssueItem";
import { useDroppable } from "@dnd-kit/core";

interface BacklogSectionProps {
    issues: IssueData[];
    onIssueClick: (issue: IssueData) => void;
    onCreateSprint: () => void;
}

function BacklogSection({ issues = [], onIssueClick, onCreateSprint }: BacklogSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { setNodeRef } = useDroppable({
        id: "backlog",
    });

    return (
        <div 
            ref={setNodeRef}
            className="w-full bg-[#0B1120] rounded-lg overflow-hidden transition-all duration-300"
        >
            {/* Header */}
            <div 
                className="flex flex-wrap items-center justify-between p-2.5 px-4 bg-[#000000] border-b border-slate-800/50 cursor-pointer select-none gap-3"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <h2 className="text-[15px] font-bold text-white tracking-tight truncate">Backlog</h2>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">({issues.length} issues)</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-5" onClick={(e) => e.stopPropagation()}>
                    <div className="hidden xs:flex items-center gap-2 mr-1">
                        <span className="text-[11px] text-slate-400">{issues.length}</span>
                        <div className="flex -space-x-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94] border border-black/10"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#4facfe] border border-black/10"></div>
                        </div>
                    </div>

                    <button 
                        className="px-3 py-1 bg-[#00FF94] hover:bg-[#00E585] text-black text-xs font-semibold rounded-[4px] transition-all duration-200 whitespace-nowrap"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCreateSprint();
                        }}
                    >
                        Create Sprint
                    </button>

                    <button className="p-1 hover:bg-slate-800 rounded transition-colors flex-shrink-0">
                        <MoreHorizontal size={18} className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Accordion Content */}
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Issues List or Empty State */}
                    {issues.length > 0 ? (
                        <div className="flex flex-col">
                            <SortableContext 
                                items={issues.map(i => i.id || i._id || "")} 
                                strategy={verticalListSortingStrategy}
                            >
                                {issues.map((issue) => (
                                    <DraggableIssueItem 
                                        key={issue.id || issue._id} 
                                        issue={issue} 
                                        onClick={onIssueClick} 
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-800/30 rounded-lg">
                                <p className="text-slate-500 text-sm">
                                    Backlog is empty, or create new issues
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer Action */}
                    <div className="px-3 py-2">
                        <button className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/20 px-2 py-1 rounded-md transition-all duration-200 group w-fit">
                            <Plus size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium">Create issue</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BacklogSection;
