import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { ChatHistoryResponse } from "../../types/chat";

export interface GetChatHistoryParams {
  projectId: string;
  limit?: number;
  offset?: number;
}

export const getChatHistory = async (
  params: GetChatHistoryParams
): Promise<ChatHistoryResponse> => {
  const response = await AxiosInstance.get(API_ROUTES.CHAT.HISTORY, {
    params: {
      projectId: params.projectId,
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });
  return response.data.data;
};
