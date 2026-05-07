import { X, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { ExtendedIssue, IssueData } from "../../../../types/BacklogTypes";

interface EpicSidebarProps {
  epics: ExtendedIssue[];
  expandedEpics: Record<string, boolean>;
  onToggleEpic: (id: string) => void;
  onOpenCreateEpic: () => void;
  onIssueClick: (issue: IssueData) => void;
  canCreateEpic?: boolean;
}

const EpicSidebar = ({ epics, expandedEpics, onToggleEpic, onOpenCreateEpic, onIssueClick, canCreateEpic = true }: EpicSidebarProps) => {
  return (
    <div className="w-[320px] bg-[#101827] mt-10 border-r border-slate-800 flex flex-col h-full rounded-tr-xl">
      <div className="flex items-center justify-between py-2.5 px-5 border-b border-slate-800/50 min-h-[44px]">
        <h2 className="text-[15px] font-bold text-white tracking-tight">Epic</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-grow p-4 space-y-3 overflow-y-auto">
        {epics.map((epic: ExtendedIssue) => (
          <div
            key={epic.id}
            className="bg-[#1A2234] rounded-lg border border-slate-800/60 overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#20293C] transition-colors"
              onClick={() => onToggleEpic(epic.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 flex items-center justify-center rounded-[4px] border shrink-0 bg-blue-500/20 text-blue-400 border-blue-500/30`}>
                  <span className="text-[10px] font-bold">E</span>
                </div>
                <span className="font-medium text-sm text-gray-200">
                  {epic.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{epic.progress}</span>
                {expandedEpics[epic.id] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {expandedEpics[epic.id] && (
              <div className="p-3 pt-1 border-t border-slate-800/50 bg-[#151C2C]">
                <div className="mb-4 space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Start Date</span>
                    <span>{epic.startDate || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date</span>
                    <span>{epic.endDate || 'Not set'}</span>
                  </div>
                  <button 
                    onClick={() => onIssueClick(epic)}
                    className="w-full mt-2 py-1.5 border border-[#2D3958] rounded-md text-blue-400 hover:bg-[#2D3958]/50 transition-colors"
                  >
                    View all details
                  </button>
                </div>

                {epic.tasks && epic.tasks.length > 0 && (
                  <div>
                    <h4 className="text-xs text-gray-500 mb-2">Story</h4>
                    {epic.tasks.map((task: ExtendedIssue, index: number) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          onIssueClick(task);
                        }}
                        className="flex items-center gap-3 p-2 bg-[#1E273A] rounded-md cursor-pointer hover:bg-[#2A364E] transition-colors"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${task.color}`}
                        ></div>
                        <span className="text-sm">{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {canCreateEpic && (
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={onOpenCreateEpic}
            className="w-full py-2 flex items-center justify-center gap-2 border border-[#2D3958] rounded-lg text-blue-400 hover:bg-[#2D3958]/30 transition-colors"
          >
            <Plus size={16} />
            Create epic
          </button>
        </div>
      )}
    </div>
  );
};

export default EpicSidebar;
