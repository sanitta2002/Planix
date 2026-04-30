import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { IssueType } from "../../types/IssueType";

export interface IAttachement {
  type: "image" | "document" | "link";
  key: string;
  fileName?: string;
}

export interface CreateIssueProps {
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string;
  issueType: IssueType;
  status?: string;
  attachments?: IAttachement[];
  parentId?: string | null;
  sprintId?: string | null;
  assigneeId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface UpdateIssueProps {
  title?: string;
  description?: string;
  status?: string;
  issueType?: IssueType;
  attachments?: IAttachement[];
  parentId?: string | null;
  sprintId?: string | null;
  assigneeId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const createIssue = async (data: CreateIssueProps) => {
  const response = await AxiosInstance.post(
    API_ROUTES.ISSUE.CREATE_ISSUE.replace(":projectId", data.projectId),
    data,
  );
  return response.data;
};

export const getIssuesByProject = async (projectId: string) => {
  const response = await AxiosInstance.get(
    API_ROUTES.ISSUE.GET_ISSUES_BY_PROJECT.replace(":projectId", projectId),
  );
  return response.data;
};

export const updateIssue = async (id: string, data: UpdateIssueProps) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.ISSUE.UPDATE_ISSUE.replace(":issueId", id),
    data,
  );
  return response.data;
};

export const uploadAttachments = async (
  issueId: string,
  files: File[],
  link?: string[],
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  if (link && link.length > 0) {
    for (const url of link) {
      formData.append("link", url);
    }
  }

  const response = await AxiosInstance.post(
    API_ROUTES.ISSUE.ADD_ATTACHMENT.replace(":issueId", issueId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
