import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export interface CreateCommentProps {
  issueId: string;
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  issueId: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}

export const createComment = async (data: CreateCommentProps): Promise<CommentResponse> => {
  const response = await AxiosInstance.post(
    API_ROUTES.COMMENT.CREATE_COMMENT.replace(":issueId", data.issueId),
    { content: data.content, issueId: data.issueId }
  );
  return response.data?.data || response.data; // Handles the ApiResponse.success wrapper
};

export const getComments = async (issueId: string): Promise<CommentResponse[]> => {
  const response = await AxiosInstance.get(
    API_ROUTES.COMMENT.GET_COMMENTS.replace(":issueId", issueId)
  );
  return response.data?.data || response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await AxiosInstance.delete(
    API_ROUTES.COMMENT.DELETE_COMMENT.replace(":commentId", commentId)
  );
};

export const updateComment = async (commentId: string, content: string): Promise<CommentResponse> => {
    const response = await AxiosInstance.patch(
        API_ROUTES.COMMENT.UPDATE_COMMENT.replace(":commentId", commentId),
        { content }
    );
    return response.data?.data || response.data;
};
