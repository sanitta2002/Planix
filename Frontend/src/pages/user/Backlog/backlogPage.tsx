import { useState } from "react";
import { useSelector } from "react-redux";
import type { EpicFormData } from "../../../components/issue/CreateEpicModal";
import { CreateEpicModal } from "../../../components/issue/CreateEpicModal";
import IssueDetail from "../../../components/issue/IssueDetail";
import { useCreateIssue, useGetIssuesByProject, useUpdateIssue, useAddAttachments } from "../../../hooks/issue/issue";
import { IssueType } from "../../../types/IssueType";
import { useMemo } from "react";
import type { RootState } from "../../../store/Store";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  ChevronDown,
  BarChart2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import type { ExtendedIssue, IssueData } from "../../../types/BacklogTypes";
import EpicSidebar from "./component/EpicSidebar";
import BacklogSection from "./component/BacklogSection";
import SprintSection from "./component/SprintSection";
import StartSprint, { type SprintFormData } from "../../../components/modal/StartSprint";
import type { ISprint } from "../../../types/Sprint";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useCreateSprint, useGetSprintsByProject, useStartSprint, useCompleteSprint } from "../../../hooks/sprint/sprintHook";
import CompleteSprintModal from "../../../components/modal/CompleteSprintModal";


function BacklogPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDrawerIssue, setSelectedDrawerIssue] = useState<IssueData | null>(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [sprintToStart, setSprintToStart] = useState<ISprint | null>(null);
  const [sprintToComplete, setSprintToComplete] = useState<ISprint | null>(null);
  const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>({
    "1": true,
  });
  const { mutateAsync: createIssue, isPending } = useCreateIssue();
  const { mutateAsync: createSprint } = useCreateSprint();
  const { mutateAsync: updateIssue } = useUpdateIssue();
  const { mutateAsync: addAttachments } = useAddAttachments();
  const { mutateAsync: startSprint, isPending: isStartingSprint } = useStartSprint();
  const { mutateAsync: completeSprint, isPending: isCompletingSprint } = useCompleteSprint();
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  );

  const { data: issuesResponse } = useGetIssuesByProject(currentProject?.id || "");
  const { data: sprintsResponse } = useGetSprintsByProject(currentProject?.id || "");

  const allIssues = issuesResponse?.data || [];
  const sprints = sprintsResponse?.data || [];

  const handleCreateSprint = async () => {
    if (!currentProject) return;

    // Calculate next sprint name (e.g. ECA Sprint 1)
    const sprintNumber = (sprints.length || 0) + 1;
    const sprintName = `${currentProject.key} Sprint ${sprintNumber}`;

    try {
      await createSprint({
        projectId: currentProject.id,
        workspaceId: currentProject.workspaceId,
        name: sprintName,
        startDate: null,
        endDate: null,
      });
      toast.success(`${sprintName} created`);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to create sprint");
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCreateEpicSubmit = async (formData: EpicFormData) => {
    if (!currentProject) return;

    try {
      const newIssueResponse = await createIssue({
        workspaceId: currentProject.workspaceId,
        projectId: currentProject.id,
        title: formData.title,
        description: formData.description,
        issueType: IssueType.EPIC,
        status: formData.status,
        parentId: null,
        sprintId: null,
        assigneeId: formData.assigneeId || null,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
      });

      const issueId = newIssueResponse?.data?._id || newIssueResponse?.data?.id || newIssueResponse?._id || newIssueResponse?.id;
      
      if (issueId && ((formData.files && formData.files.length > 0) || (formData.links && formData.links.length > 0))) {
        await addAttachments({
          issueId: issueId,
          files: formData.files || [],
          links: formData.links || [],
        });
      }

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


  const epics: ExtendedIssue[] = useMemo(() => {
    return allIssues
      .filter((issue: IssueData) => (issue.issueType || (issue).type) === IssueType.EPIC)
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
    return (allIssues as IssueData[]).filter((issue) => {
      const type = (issue.issueType || issue.type || "").toUpperCase();
      const isNotEpic = type !== IssueType.EPIC;
      const isInBacklog = !issue.sprintId || issue.sprintId === "" || issue.sprintId === null;
      return isNotEpic && isInBacklog;
    });
  }, [allIssues]);

  const activeDrawerIssue = useMemo(() => {
    if (!selectedDrawerIssue) return null;
    const targetId = selectedDrawerIssue.id || (selectedDrawerIssue)._id;
    if (!targetId) return selectedDrawerIssue;

    let found: ExtendedIssue | null = null;
    for (const epic of epics) {
      if ((epic.id || (epic)._id) === targetId) found = epic;
      if (epic.tasks) {
        for (const task of epic.tasks) {
          if ((task.id || (task)._id) === targetId) found = task;
          if (task.tasks) {
            for (const sub of task.tasks) {
              if ((sub.id || (sub)._id) === targetId) found = sub;
            }
          }
        }
      }
    }
    return found || (selectedDrawerIssue);
  }, [epics, selectedDrawerIssue]);

  const handleOpenStartModal = (sprint: ISprint) => {
    setSprintToStart(sprint);
    setIsStartModalOpen(true);
  };

  const handleCloseStartModal = () => {
    setIsStartModalOpen(false);
    setSprintToStart(null);
  };

  const handleStartSprintSubmit = async (formData: SprintFormData) => {
    if (!sprintToStart) return;

    try {
      await startSprint({
        sprintId: sprintToStart._id,
        data: {
          name: formData.name,
          goal: formData.goal,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        },
      });
      toast.success(`${formData.name} started`);
      handleCloseStartModal();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to start sprint");
      }
    }
  };

  const handleOpenCompleteModal = (sprint: ISprint) => {
    setSprintToComplete(sprint);
    setIsCompleteModalOpen(true);
  };

  const handleCloseCompleteModal = () => {
    setIsCompleteModalOpen(false);
    setSprintToComplete(null);
  };

  const handleCompleteSprintSubmit = async (moveToSprintId?: string) => {
    if (!sprintToComplete) return;

    try {
      await completeSprint({ 
        sprintId: sprintToComplete._id, 
        moveToSprintId 
      });
      toast.success(`${sprintToComplete.name} completed`);
      handleCloseCompleteModal();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Failed to complete sprint");
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const issueId = active.id as string;
    const overId = over.id as string;

    // Determine the target sprintId
    let newSprintId: string | null = null;

    if (overId === "backlog") {
      newSprintId = null;
    } else {
      // Check if overId is a sprint ID
      const targetSprint = sprints.find((s) => s._id === overId);
      if (targetSprint) {
        newSprintId = targetSprint._id;
      } else {
        // Check if overId is an issue ID
        const targetIssue = allIssues.find((i) => (i.id || i._id) === overId);
        if (targetIssue) {
          newSprintId = targetIssue.sprintId || null;
        }
      }
    }

    // Find the active issue
    const activeIssue = allIssues.find((i) => (i.id || i._id) === issueId);

    // Only update if the sprintId actually changed
    if (activeIssue && activeIssue.sprintId !== newSprintId) {
      try {
        await updateIssue({
          id: issueId,
          data: { sprintId: newSprintId }
        });
        toast.success(newSprintId ? "Issue added to sprint" : "Issue moved to backlog");
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message || "Failed to move issue");
        }
      }
    }
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex bg-[#0B1120] text-gray-300 min-h-screen">
        <EpicSidebar
          epics={epics}
          expandedEpics={expandedEpics}
          onToggleEpic={toggleEpic}
          onOpenCreateEpic={() => setIsOpen(true)}
          onIssueClick={setSelectedDrawerIssue}
        />

        <div className="flex-grow p-8 px-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex -space-x-2"></div>
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

          <div className="flex flex-col gap-8 max-w-[1200px]">
            {/* Dynamic Sprints */}
            {sprints.filter((s: ISprint) => s.status !== "COMPLETED").length > 0 ? (
              sprints
                .filter((s: ISprint) => s.status !== "COMPLETED")
                .map((sprint: ISprint) => (
                  <SprintSection
                    key={sprint._id}
                    sprint={sprint}
                    issues={allIssues.filter((i: IssueData) => i.sprintId === sprint._id)}
                    onIssueClick={setSelectedDrawerIssue}
                    onStartSprint={handleOpenStartModal}
                    onCompleteSprint={handleOpenCompleteModal}
                  />
                ))
            ) : (
              <div className="bg-[#0B1120] border-2 border-dashed border-slate-800/20 rounded-xl p-10 flex flex-col items-center justify-center gap-4 group hover:border-slate-800/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Plus size={24} />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-base mb-1">Start planning with sprints</h3>
                  <p className="text-slate-500 text-sm max-w-[300px]">
                    Create a sprint to start organizing your work and tracking progress.
                  </p>
                </div>
                <button
                  onClick={handleCreateSprint}
                  className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-all duration-200 shadow-lg shadow-blue-900/20"
                >
                  Create Sprint
                </button>
              </div>
            )}

            {/* Backlog */}
            <BacklogSection
              issues={backlogIssues}
              onIssueClick={setSelectedDrawerIssue}
              onCreateSprint={handleCreateSprint}
            />
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

        <StartSprint
          key={sprintToStart?._id || "start-sprint"}
          isOpen={isStartModalOpen}
          onClose={handleCloseStartModal}
          onSubmit={handleStartSprintSubmit}
          isLoading={isStartingSprint}
          initialName={sprintToStart?.name}
          initialGoal={sprintToStart?.goal}
        />

        <CompleteSprintModal
          isOpen={isCompleteModalOpen}
          onClose={handleCloseCompleteModal}
          onComplete={handleCompleteSprintSubmit}
          sprint={sprintToComplete!}
          issues={allIssues.filter((i: any) => i.sprintId === sprintToComplete?._id)}
          plannedSprints={sprints.filter((s: any) => s.status === "PLANNED")}
          isLoading={isCompletingSprint}
        />
      </div>
    </DndContext>
  );
}

export default BacklogPage;