export interface IssueAttachmentResponse {
  key: string;
  type: 'image' | 'document' | 'link';
  fileName?: string;
  url?: string;
}
