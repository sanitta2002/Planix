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
  isEdited: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ChatHistoryResponse {
  messages: MessageResponse[];
  total: number;
}
