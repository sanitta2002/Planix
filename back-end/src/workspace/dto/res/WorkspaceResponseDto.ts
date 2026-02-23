export class WorkspaceResponseDto {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[];
  subscriptionId?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}
