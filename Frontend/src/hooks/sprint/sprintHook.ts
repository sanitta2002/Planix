import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSprint,
  getSprintsByProject,
  startSprint,
  completeSprint,
} from "../../Service/sprint/sprintService";
import type { CreateSprintProps, UpdateSprintProps } from "../../types/Sprint";

export const useCreateSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSprintProps) => createSprint(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sprints", variables.projectId],
      });
    },
  });
};

export const useGetSprintsByProject = (projectId: string) => {
  return useQuery({
    queryKey: ["sprints", projectId],
    queryFn: () => getSprintsByProject(projectId),
    enabled: !!projectId,
  });
};

export const useStartSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sprintId,
      data,
    }: {
      sprintId: string;
      data: UpdateSprintProps;
    }) => startSprint(sprintId, data),
    onSuccess: (response) => {
      const projectId = response?.data?.projectId;
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
    },
  });
};

export const useCompleteSprint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sprintId,
      moveToSprintId,
    }: {
      sprintId: string;
      moveToSprintId?: string;
    }) => completeSprint(sprintId, moveToSprintId),
    onSuccess: (response) => {
      const projectId = response?.data?.projectId;
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};
