export interface AttachmentResponse {
  fileKey: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  fileUrl?: string;
}

export interface MessageResponse {
  id: string;
  projectId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content?: string;
  attachments: AttachmentResponse[];
  isEdited?: boolean;
  createdAt: string;
}

export interface ChatHistoryResponse {
  messages: MessageResponse[];
  total: number;
}

export interface SendMessagePayload {
  projectId: string;
  content?: string;
  attachments?: {
    fileKey: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
  }[];
}
