import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIssue,
  getIssuesByProject,
  updateIssue,
  uploadAttachments,
  deleteAttachment,
  type CreateIssueProps,
  type UpdateIssueProps,
  type IAttachement,
} from "../../Service/issue/issue";

export interface IssueData {
  id: string;
  _id?: string;
  title: string;
  status: string;
  type?: string;
  issueType?: string;
  key: string;
  assigneeId?: string | null;
  sprintId?: string | null;
  createdAt: string;
  parentId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  attachments?: IAttachement[];
  projectId?: string;
  estimatedHours?: number;
}

export interface GetIssuesResponse {
  data: IssueData[];
}

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIssueProps) => createIssue(data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData<GetIssuesResponse>(
        ["issues", variables.projectId],
        (oldData) => {
          if (!oldData) return { data: [response.data] };
          return {
            ...oldData,
            data: [...oldData.data, response.data],
          };
        }
      );
    },
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIssueProps }) =>
      updateIssue(id, data),
    onSuccess: (response) => {
      const updatedIssue = response.data;
      const projectId = updatedIssue?.projectId;
      if (projectId) {
        queryClient.setQueryData<GetIssuesResponse>(
          ["issues", projectId],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((issue: IssueData) =>
                issue.id === updatedIssue.id ? updatedIssue : issue
              ),
            };
          }
        );
      }
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
      const updatedIssue = response.data;
      const projectId = updatedIssue?.projectId;
      if (projectId) {
        queryClient.setQueryData<GetIssuesResponse>(
          ["issues", projectId],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((issue: IssueData) =>
                issue.id === updatedIssue.id ? updatedIssue : issue
              ),
            };
          }
        );
      }
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
      const updatedIssue = response.data;
      const projectId = updatedIssue?.projectId;
      if (projectId) {
        queryClient.setQueryData<GetIssuesResponse>(
          ["issues", projectId],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((issue: IssueData) =>
                issue.id === updatedIssue.id ? updatedIssue : issue
              ),
            };
          }
        );
      }
    },
  });
};
