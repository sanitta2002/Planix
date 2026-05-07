import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  CheckCircle2,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';
import { useGetIssuesByProject, useUpdateIssue } from '../../../hooks/issue/issue';
import { useGetSprintsByProject, useCompleteSprint } from '../../../hooks/sprint/sprintHook';
import { IssueStatus, IssueType } from '../../../types/IssueType';
import { SprintStatus } from '../../../types/Sprint';
import { FRONTEND_ROUTES } from '../../../constants/frontRoutes';
import { AxiosError } from "axios";
import { toast } from "sonner";
import CompleteSprintModal from "../../../components/modal/CompleteSprintModal";
import BoardColumn from './component/BoardColumn';
import BoardCard from './component/BoardCard';
import type { RootState } from '../../../store/Store';
import type {  IssueData } from '../../../types/BacklogTypes';
import type  { ISprint } from '../../../types/Sprint';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';

const BoardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpic, setSelectedEpic] = useState('all');
  const [selectedSprintId, setSelectedSprintId] = useState('active');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const { data: issuesResponse } = useGetIssuesByProject(currentProject?.id || '');
  const { data: sprintsResponse } = useGetSprintsByProject(currentProject?.id || '');
  const { mutateAsync: updateIssue } = useUpdateIssue();
  const { mutateAsync: completeSprint, isPending: isCompletingSprint } = useCompleteSprint();

  const allIssues = issuesResponse?.data || [];
  const allSprints = sprintsResponse?.data || [];

 
  const activeSprint = useMemo<ISprint | undefined>(() => {
    if (selectedSprintId === 'active') {
      return allSprints.find((s: ISprint) => s.status === SprintStatus.ACTIVE);
    }
    return allSprints.find((s: ISprint) => s._id === selectedSprintId);
  }, [allSprints, selectedSprintId]);

  const epics = useMemo<IssueData[]>(() => {
    return allIssues.filter((i: IssueData) => (i.issueType || i.type) === IssueType.EPIC);
  }, [allIssues]);

 
  const filteredIssues = useMemo<IssueData[]>(() => {
    let issues = allIssues;

  
    if (activeSprint) {
      issues = issues.filter((i: IssueData) => i.sprintId === activeSprint._id);
    } else if (selectedSprintId === 'active') {
      issues = [];
    }

  
    if (searchQuery) {
      issues = issues.filter((i: IssueData) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    if (selectedEpic !== 'all') {
      issues = issues.filter((i: IssueData) => i.parentId === selectedEpic);
    }

    return issues.filter((i: IssueData) => (i.issueType || i.type) !== IssueType.EPIC);
  }, [allIssues, activeSprint, searchQuery, selectedEpic, selectedSprintId]);


  const issuesByStatus = useMemo(() => {
    return {
      TODO: filteredIssues.filter((i: IssueData) => i.status === IssueStatus.TODO),
      IN_PROGRESS: filteredIssues.filter((i: IssueData) => i.status === IssueStatus.IN_PROGRESS),
      DONE: filteredIssues.filter((i: IssueData) => i.status === IssueStatus.DONE),
    };
  }, [filteredIssues]);

  const activeIssue = useMemo(() => {
    if (!activeId) return null;
    return allIssues.find((i: IssueData) => (i.id || i._id) === activeId) as IssueData || null;
  }, [activeId, allIssues]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const issueId = active.id;
    let newStatus = over.id as string;

    // Resolve status if dropped on a card instead of a column
    const isStatus = Object.values(IssueStatus).includes(newStatus as IssueStatus);
    
    if (!isStatus) {
      const targetIssue = allIssues.find((i: IssueData) => (i.id || i._id) === newStatus);
      if (targetIssue) {
        newStatus = targetIssue.status;
      }
    }

    // Only update if status actually changed
    const draggedIssue = allIssues.find((i: IssueData) => (i.id || i._id) === (issueId as string));
    if (draggedIssue && draggedIssue.status !== newStatus) {
      try {
        await updateIssue({
          id: issueId as string,
          data: { status: newStatus }
        });
      } catch (err) {
        console.error("Failed to update status", err);
      }
    }
  };

  const handleCompleteSprintSubmit = async (moveToSprintId?: string) => {
    if (!activeSprint) return;

    try {
      await completeSprint({ 
        sprintId: activeSprint._id, 
        moveToSprintId 
      });
      toast.success(`${activeSprint.name} completed`);
      setIsCompleteModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to complete sprint");
      }
    }
  };

  const hasActiveSprints = allSprints.some((s: ISprint) => s.status === SprintStatus.ACTIVE);


  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col min-h-screen bg-[#0B1120] text-foreground p-6 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sprint Board</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage and track your team's progress
            </p>
          </div>

          {activeSprint && (
            <button 
              onClick={() => setIsCompleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Sprint
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-10 bg-secondary/20 p-3 rounded-2xl border border-border/40 backdrop-blur-md">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full bg-background/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Epic Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-background/50 border border-border/50 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
              value={selectedEpic}
              onChange={(e) => setSelectedEpic(e.target.value)}
            >
              <option value="all">All Epics</option>
              {epics.map((epic: IssueData) => (
                <option key={epic.id || epic._id} value={epic.id || epic._id}>
                  {epic.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Sprint Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-background/50 border border-border/50 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
            >
              <option value="active">Active Sprint</option>
              {allSprints.map((sprint: ISprint) => (
                <option key={sprint._id} value={sprint._id}>
                  {sprint.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Avatars */}
          <div className="flex items-center -space-x-2 ml-auto mr-4">
            {currentProject?.members?.slice(0, 4).map((member) => (
              <div key={member.user.id} className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-secondary flex items-center justify-center overflow-hidden transition-transform hover:scale-110 cursor-pointer shadow-lg" title={member.user.firstName}>
                {member.user.avatarUrl ? (
                  <img src={member.user.avatarUrl} alt={member.user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.firstName}`} alt={member.user.firstName} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
            {(currentProject?.members?.length || 0) > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border-dashed">
                +{(currentProject?.members?.length || 0) - 4}
              </div>
            )}
          </div>

          {/* Action button */}
          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Board Content */}
        {!hasActiveSprints && selectedSprintId === 'active' ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-white/5 rounded-[2.5rem] bg-gradient-to-b from-secondary/10 to-background/50 mt-4 mb-8 relative overflow-hidden shadow-2xl" style={{ minHeight: '50vh' }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
            <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/50 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5 shadow-inner relative z-10">
              <AlertCircle className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight relative z-10">No Active Sprint</h2>
            <p className="text-muted-foreground text-sm max-w-sm text-center mb-8 px-6 leading-relaxed relative z-10">
              Start a sprint in the Backlog to view and manage your team's tasks on this board.
            </p>
            <button 
              onClick={() => navigate(FRONTEND_ROUTES.BACKLOG)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 relative z-10"
            >
              Go to Backlog
            </button>
          </div>
        ) : (
          <div className="h-fit flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            <BoardColumn
              title="TO DO"
              status={IssueStatus.TODO}
              count={issuesByStatus.TODO.length}
              color="bg-blue-500"
              issues={issuesByStatus.TODO}
            >
              {issuesByStatus.TODO.map((issue) => (
                <BoardCard key={issue.id || issue._id} issue={issue} />
              ))}
            </BoardColumn>

            <BoardColumn
              title="IN PROGRESS"
              status={IssueStatus.IN_PROGRESS}
              count={issuesByStatus.IN_PROGRESS.length}
              color="bg-amber-500"
              issues={issuesByStatus.IN_PROGRESS}
            >
              {issuesByStatus.IN_PROGRESS.map((issue) => (
                <BoardCard key={issue.id || issue._id} issue={issue} />
              ))}
            </BoardColumn>

            <BoardColumn
              title="DONE"
              status={IssueStatus.DONE}
              count={issuesByStatus.DONE.length}
              color="bg-emerald-500"
              issues={issuesByStatus.DONE}
            >
              {issuesByStatus.DONE.map((issue) => (
                <BoardCard key={issue.id || issue._id} issue={issue} />
              ))}
            </BoardColumn>
          </div>
        )}
        <DragOverlay>
          {activeIssue ? (
            <div className="rotate-3 scale-105 opacity-90 shadow-2xl">
              <BoardCard issue={activeIssue} />
            </div>
          ) : null}
        </DragOverlay>

        {activeSprint && (
          <CompleteSprintModal
            isOpen={isCompleteModalOpen}
            onClose={() => setIsCompleteModalOpen(false)}
            onComplete={handleCompleteSprintSubmit}
            sprint={activeSprint}
            issues={allIssues.filter((i: IssueData) => i.sprintId === activeSprint._id)}
            plannedSprints={allSprints.filter((s: ISprint) => s.status === "PLANNED")}
            isLoading={isCompletingSprint}
          />
        )}
      </div>
    </DndContext>
  );
};

export default BoardPage;


