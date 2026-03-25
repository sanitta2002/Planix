export class WorkspaceResponseDto {
  id: string;
  name: string;
  description?: string;
  ownerId: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  members: string[];
  subscriptionId?: string;
  logo?: string;
  logoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  subscriptionStatus: string;
}
