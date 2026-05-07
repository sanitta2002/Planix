import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIssue,
  getIssuesByProject,
  updateIssue,
  uploadAttachments,
  deleteAttachment,
  type CreateIssueProps,
  type UpdateIssueProps,
} from "../../Service/issue/issue";

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIssueProps) => createIssue(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["issues", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIssueProps }) =>
      updateIssue(id, data),
    onSuccess: (response) => {
      const projectId = response?.data?.projectId;
      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};

export const useGetIssuesByProject = (projectId: string) => {
  return useQuery({
    queryKey: ["issues", projectId],
    queryFn: () => getIssuesByProject(projectId),
    enabled: !!projectId,
  });
};

export const useAddAttachments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      issueId,
      files,
      link,
    }: {
      issueId: string;
      files: File[];
      link?: string[];
    }) => uploadAttachments(issueId, files, link),

    onSuccess: (response) => {
      const projectId = response?.data?.projectId;

      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      issueId,
      attachmentKey,
    }: {
      issueId: string;
      attachmentKey: string;
    }) => deleteAttachment(issueId, attachmentKey),

    onSuccess: (response) => {
      const projectId = response?.data?.projectId;

      queryClient.invalidateQueries({ queryKey: ["issues", projectId] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};
