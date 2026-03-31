export class ProjectListItemDto {
  id: string;
  projectName: string;
  key: string;
  description: string;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
  members?: {
    user: {
      id: string;
      firstName: string;
    };
    role: {
      id: string;
      name: string;
    };
  }[];
}
