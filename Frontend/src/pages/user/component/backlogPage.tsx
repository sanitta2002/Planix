import { useState } from "react";
import { useSelector } from "react-redux";
import type { EpicFormData } from "../../../components/issue/CreateEpicModal";
import { CreateEpicModal } from "../../../components/issue/CreateEpicModal";
import IssueDetail from "../../../components/issue/IssueDetail";
import { useCreateIssue, useGetIssuesByProject, useUpdateIssue } from "../../../hooks/issue/issue";
import { IssueType } from "../../../types/IssueType";
import { useMemo } from "react";
import type { RootState } from "../../../store/Store";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  X,
  BarChart2,
  MoreHorizontal,
  Plus,
} from "lucide-react";

interface IssueData {
  id: string;
  _id?: string;
  title: string;
  status: string;
  type?: string;
  issueType?: string;
  key: string;
  assigneeId?: string | null;
  createdAt: string;
  parentId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

interface ExtendedIssue extends IssueData {
    color?: string;
    progress?: string;
    parentTitle?: string;
    tasks?: ExtendedIssue[];
}

function BacklogPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDrawerIssue, setSelectedDrawerIssue] = useState<IssueData | null>(null);
  
  const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>({
    "1": true,
  });
  const [sprintExpanded, setSprintExpanded] = useState(true);
  const [backlogExpanded, setBacklogExpanded] = useState(true);
  
  // Local state to track frontend drag & drop sprint assignments before backend APIs exist
  const [localSprintAssignments, setLocalSprintAssignments] = useState<Record<string, string>>({});

  const { mutateAsync: createIssue, isPending } = useCreateIssue();
  const { mutate: updateIssueStatus } = useUpdateIssue();

  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const activeSprintName = `${currentProject?.key || 'ECA'} Sprint 1`;

  const handleCreateEpicSubmit = async (formData: EpicFormData) => {
    if (!currentProject) return;

    try {
      await createIssue({
        workspaceId: currentProject.workspaceId,
        projectId: currentProject.id,
        title: formData.title,
        description: formData.description,
        issueType: IssueType.EPIC,
        status: formData.status,
        parentId: null,
        sprintId: null,
        assigneeId: formData.assigneeId || null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        attachments: formData.attachments,
      });

      toast.success("Epic created successfully");
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  const toggleEpic = (id: string) => {
    setExpandedEpics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { data: issuesResponse } = useGetIssuesByProject(currentProject?.id || "");
  const allIssues = issuesResponse?.data || [];

  console.log("Raw fetched issues:", allIssues);

  const epics: ExtendedIssue[] = useMemo(() => {
    return allIssues
      .filter((issue: IssueData) => (issue.issueType || issue.type) === IssueType.EPIC)
      .map((epic: IssueData): ExtendedIssue => {
        const epicsTasks = allIssues.filter((task: IssueData) => task.parentId === epic.id);
        const completedTasks = epicsTasks.filter((task: IssueData) => task.status === "DONE").length;

        return {
          ...epic,
          id: epic.id,
          title: epic.title,
          color: "bg-blue-500",
          progress: `${completedTasks}/${epicsTasks.length}`,
          startDate: epic.startDate ? new Date(epic.startDate).toLocaleDateString() : null,
          endDate: epic.endDate ? new Date(epic.endDate).toLocaleDateString() : null,
          tasks: epicsTasks.map((task: IssueData): ExtendedIssue => {
            const taskChildren = allIssues.filter((child: IssueData) => child.parentId === task.id);
            return {
              ...task,
              title: task.title,
              color: "bg-yellow-500",
              parentTitle: epic.title,
              tasks: taskChildren.map((child: IssueData): ExtendedIssue => ({
                ...child,
                parentTitle: task.title
              })),
            };
          }),
        };
      });
  }, [allIssues]);

  const backlogIssues = useMemo(() => {
    return allIssues.filter(
      (issue: IssueData) =>
        (issue.issueType || issue.type) !== IssueType.EPIC &&
        (issue.issueType || issue.type) !== "SUBTASK" &&
        localSprintAssignments[issue.id || (issue as any)._id] !== activeSprintName
    );
  }, [allIssues, localSprintAssignments, activeSprintName]);

  const activeSprintIssues = useMemo(() => {
    return allIssues.filter(
      (issue: IssueData) => localSprintAssignments[issue.id || (issue)._id] === activeSprintName
    );
  }, [allIssues, localSprintAssignments, activeSprintName]);

  const handleDragStart = (e: React.DragEvent, issue: IssueData) => {
    e.dataTransfer.setData("issueId", issue.id || (issue)._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropToSprint = (e: React.DragEvent, targetSprint: string) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData("issueId");
    if (!issueId) return;

    setLocalSprintAssignments(prev => ({ ...prev, [issueId]: targetSprint }));
  };

  const handleDropToBacklog = (e: React.DragEvent) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData("issueId");
    if (!issueId) return;

    setLocalSprintAssignments(prev => {
        const next = { ...prev };
        delete next[issueId];
        return next;
    });
  };

  const activeDrawerIssue = useMemo(() => {
    if (!selectedDrawerIssue) return null;
    const targetId = selectedDrawerIssue.id || (selectedDrawerIssue as IssueData)._id;
    if (!targetId) return selectedDrawerIssue;

    let found: ExtendedIssue | null = null;
    for (const epic of epics) {
      if ((epic.id || (epic as IssueData)._id) === targetId) found = epic;
      if (epic.tasks) {
        for (const task of epic.tasks) {
          if ((task.id || (task as IssueData)._id) === targetId) found = task;
          if (task.tasks) {
            for (const sub of task.tasks) {
              if ((sub.id || (sub as IssueData)._id) === targetId) found = sub;
            }
          }
        }
      }
    }
    return found || selectedDrawerIssue;
  }, [epics, selectedDrawerIssue]);

  return (
    <div className="flex bg-[#0B1120] text-gray-300 min-h-screen">
      {/* Left Sidebar: Epic Panel */}
      <div className="w-[320px] bg-[#101827] border-r border-slate-800 flex flex-col h-full rounded-tr-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <h2 className="text-lg font-semibold text-white">Epic</h2>
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
                onClick={() => toggleEpic(epic.id)}
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
                      onClick={() => setSelectedDrawerIssue(epic)}
                      className="w-full mt-2 py-1.5 border border-[#2D3958] rounded-md text-blue-400 hover:bg-[#2D3958]/50 transition-colors"
                    >
                      View all details
                    </button>
                  </div>

                  {epic.tasks && epic.tasks.length > 0 && (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-2">Story</h4>
                      {epic.tasks && epic.tasks.map((task: ExtendedIssue, index: number) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrawerIssue(task);
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

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-2 flex items-center justify-center gap-2 border border-[#2D3958] rounded-lg text-blue-400 hover:bg-[#2D3958]/30 transition-colors"
          >
            <Plus size={16} />
            Create epic
          </button>
        </div>
      </div>

      {/* Right Area: Sprints and Backlog */}
      <div className="flex-grow p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex -space-x-2">
            {/* <img
              className="w-8 h-8 rounded-full border-2 border-[#0B1120]"
              src="https://avatars.githubusercontent.com/u/1?v=4"
              alt="User"
            /> */}
            {/* <img
              className="w-8 h-8 rounded-full border-2 border-[#0B1120]"
              src="https://avatars.githubusercontent.com/u/2?v=4"
              alt="User"
            /> */}
            {/* <div className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-slate-700 flex items-center justify-center">
              <span className="text-xs">👥</span>
            </div> */}
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 bg-[#1A2234] rounded-md text-sm border border-slate-800 flex items-center gap-2 hover:bg-[#20293C]">
              Epic
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            <button className="px-4 py-1.5 bg-[#17204A] text-blue-400 rounded-md text-sm flex items-center gap-2 hover:bg-[#1C275A]">
              <BarChart2 size={14} />
              Insights
            </button>
            <button className="p-1.5 bg-[#1A2234] rounded-md text-gray-400 hover:text-white border border-slate-800 flex items-center justify-center">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Sprint Block */}
        <div className="bg-[#101827] rounded-lg border border-slate-800 overflow-hidden mb-6">
          <div
            className="flex items-center justify-between p-3 bg-[#131B2B] cursor-pointer"
            onClick={() => setSprintExpanded(!sprintExpanded)}
          >
            <div className="flex items-center gap-4">
              {sprintExpanded ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
              <h3 className="font-semibold text-white">{activeSprintName}</h3>
              <button className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                <Plus size={12} /> Add dates
              </button>
              <span className="text-xs text-gray-500">(0 issues)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">0</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <button className="px-3 py-1 bg-[#2C3B5E] text-slate-300 text-xs rounded hover:bg-[#34456c]">
                Start sprint
              </button>
              <MoreHorizontal size={14} className="text-gray-400" />
            </div>
          </div>

          {sprintExpanded && (
            <div 
              className="p-4 bg-[#101827] min-h-[150px] transition-colors"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropToSprint(e, activeSprintName)}
            >
              {activeSprintIssues.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-lg p-10 flex flex-col items-center justify-center text-center">
                  <h4 className="text-gray-300 font-medium mb-1">
                    Plan your sprint
                  </h4>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Drag issues from the Backlog section, or create new issues, to
                    plan the work for this sprint.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {activeSprintIssues.map((issue) => (
                    <div
                      key={issue.id || (issue as IssueData)._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawerIssue(issue);
                      }}
                      className="flex items-center justify-between p-3 bg-[#1A2542] rounded-lg border border-[#23355B] hover:border-blue-500/50 cursor-grab active:cursor-grabbing transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-[4px] border shrink-0 ${
                          (issue.issueType || issue.type || "").toUpperCase() === 'SUBTASK' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                          (issue.issueType || issue.type || "").toUpperCase() === 'BUG' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                          (issue.issueType || issue.type || "").toUpperCase() === 'TASK' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          (issue.issueType || issue.type || "").toUpperCase() === 'STORY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          <span className="text-[10px] font-bold">
                            {(issue.issueType || issue.type || "T").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-sm">
                          {issue.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={issue.status || "TODO"}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateIssueStatus({ 
                                id: issue.id || (issue as IssueData)._id || "", 
                                data: { status: e.target.value } 
                            });
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-full border bg-[#1A2542] cursor-pointer focus:outline-none transition-colors ${
                            issue.status === 'DONE' ? 'text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50' :
                            issue.status === 'IN_PROGRESS' || issue.status === 'IN PROGRESS' ? 'text-blue-400 border-blue-500/20 hover:border-blue-500/50' :
                            'text-zinc-400 border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="DONE">DONE</option>
                        </select>
                        <div className="w-6 h-6 rounded-full bg-[#1E293B] border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 shrink-0">
                          U
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-3 text-sm text-gray-400 hover:text-white flex items-center gap-2 pl-2">
                <Plus size={14} /> Create issue
              </button>
            </div>
          )}
        </div>

        {/* Backlog Block */}
        <div className="bg-[#101827] rounded-lg border border-slate-800 overflow-hidden">
          <div
            className="flex items-center justify-between p-3 bg-[#131B2B] cursor-pointer"
            onClick={() => setBacklogExpanded(!backlogExpanded)}
          >
            <div className="flex items-center gap-4">
              {backlogExpanded ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
              <h3 className="font-semibold text-white">Backlog</h3>
              <span className="text-xs text-gray-500">({backlogIssues.length} issues)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">0</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <button className="px-3 py-1 bg-green-500 text-black font-medium text-xs rounded hover:bg-green-400">
                Create Sprint
              </button>
              <MoreHorizontal size={14} className="text-gray-400" />
            </div>
          </div>

          {backlogExpanded && (
            <div 
              className="p-4 bg-[#101827] min-h-[150px]"
              onDragOver={handleDragOver}
              onDrop={handleDropToBacklog}
            >
              {backlogIssues.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-lg p-10 flex flex-col items-center justify-center text-center">
                  <h4 className="text-gray-400 font-medium">
                    Backlog is empty, or create new issues
                  </h4>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {backlogIssues.map((issue) => (
                    <div
                      key={issue.id || (issue as IssueData)._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawerIssue(issue);
                      }}
                      className="flex items-center justify-between p-3 bg-[#1A2542] rounded-lg border border-[#23355B] hover:border-blue-500/50 cursor-grab active:cursor-grabbing transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-[4px] border shrink-0 ${
                          (issue.issueType || issue.type || "").toUpperCase() === 'SUBTASK' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                          (issue.issueType || issue.type || "").toUpperCase() === 'BUG' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                          (issue.issueType || issue.type || "").toUpperCase() === 'TASK' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          (issue.issueType || issue.type || "").toUpperCase() === 'STORY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          <span className="text-[10px] font-bold">
                            {(issue.issueType || issue.type || "T").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-sm">
                          {issue.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={issue.status || "TODO"}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateIssueStatus({ 
                                id: issue.id || (issue as IssueData)._id || "", 
                                data: { status: e.target.value } 
                            });
                          }}
                          className={`px-2 py-1 text-[10px] font-bold rounded-full border bg-[#1A2542] cursor-pointer focus:outline-none transition-colors ${
                            issue.status === 'DONE' ? 'text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50' :
                            issue.status === 'IN_PROGRESS' || issue.status === 'IN PROGRESS' ? 'text-blue-400 border-blue-500/20 hover:border-blue-500/50' :
                            'text-zinc-400 border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="DONE">DONE</option>
                        </select>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-4 text-sm text-gray-400 hover:text-white flex items-center gap-2 pl-2">
                <Plus size={14} /> Create issue
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateEpicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateEpicSubmit}
        isLoading={isPending}
        projectName={currentProject?.projectName || ""}
        projectKey={currentProject?.key || ""}
      />

      <IssueDetail 
        isOpen={!!selectedDrawerIssue}
        onClose={() => setSelectedDrawerIssue(null)}
        issue={activeDrawerIssue}
        onIssueClick={(issue) => setSelectedDrawerIssue(issue)}
      />
    </div>
  );
}

export default BacklogPage;