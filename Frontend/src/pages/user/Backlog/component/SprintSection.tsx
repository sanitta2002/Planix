
import { useState } from "react";
import { ChevronUp, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { SprintStatus, type ISprint } from "../../../../types/Sprint";
import type { IssueData } from "../../../../types/BacklogTypes";
import DraggableIssueItem from "./DraggableIssueItem";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";

interface SprintSectionProps {
    sprint: ISprint;
    issues: IssueData[];
    onIssueClick: (issue: IssueData) => void;
    onStartSprint: (sprint: ISprint) => void;
    onCompleteSprint: (sprint: ISprint) => void;
}

function SprintSection({ sprint, issues = [], onIssueClick, onStartSprint, onCompleteSprint }: SprintSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { setNodeRef } = useDroppable({
        id: sprint._id,
    });

    const todoIssues = issues.filter(i => i.status === "TODO"); 
    const inProgressIssues = issues.filter(i => i.status === "IN_PROGRESS"); 
    const doneIssues = issues.filter(i => i.status === "DONE"); 

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
                    <h2 className="text-[15px] font-bold text-white tracking-tight truncate">{sprint.name}</h2>
                    
                    
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">({issues.length} issues)</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-5" onClick={(e) => e.stopPropagation()}>
                    <div className="hidden xs:flex items-center gap-2 mr-1">
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-black/10"></div>
                            <span className="text-[11px] text-slate-400">{todoIssues.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#4facfe] border border-black/10"></div>
                            <span className="text-[11px] text-slate-400">{inProgressIssues.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94] border border-black/10"></div>
                            <span className="text-[11px] text-slate-400">{doneIssues.length}</span>
                        </div>
                    </div>

                    {sprint.status?.toString().toUpperCase() !== "COMPLETED" && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const currentStatus = sprint.status?.toString().toUpperCase();
                                if (currentStatus === "ACTIVE") {
                                    onCompleteSprint(sprint);
                                } else {
                                    onStartSprint(sprint);
                                }
                            }}
                            className="px-3 py-1 bg-[#1A2234] hover:bg-[#20293C] text-zinc-200 text-xs font-semibold rounded-[4px] border border-slate-800/50 transition-all duration-200 whitespace-nowrap"
                        >
                            {sprint.status?.toString().toUpperCase() === "ACTIVE" ? "Complete sprint" : "Start sprint"}
                        </button>
                    )}

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
                            <div className="flex flex-col items-center justify-center py-8 sm:py-12 border-2 border-dashed border-slate-800/30 rounded-lg">
                                <h3 className="text-white font-semibold text-base mb-1">Plan your sprint</h3>
                                <p className="text-slate-500 text-sm max-w-[400px] text-center px-4 leading-relaxed">
                                    Drag issues from the Backlog section, or create new issues, to plan the work for this sprint.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Footer Action */}
                    <div className="px-3 pb-3">
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

export default SprintSection;
