import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getAllProjects,
  removeProjectMember,
  updateProject,
  type GetAllProjectsParams,
} from "../../Service/project/projectService";

export const useGetAllProjects = (params: GetAllProjectsParams) => {
  const { workspaceId, page = 1, limit = 5, search = "" } = params;

  return useQuery({
    queryKey: ["projects", workspaceId, page, limit, search],
    queryFn: () => getAllProjects({ workspaceId, page, limit, search }),
    enabled: !!workspaceId,
    placeholderData: (prev) => prev,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"]});
    },
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => removeProjectMember(projectId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
