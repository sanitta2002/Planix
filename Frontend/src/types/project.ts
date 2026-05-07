interface Member {
  user: {
    id: string;
    firstName: string;
    avatarUrl?: string;
  };
  role: {
    id: string;
    name: string;
    permissions?: string[];
  };
}

export interface Project {
  id: string;
  projectName: string;
  key: string;
  description: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;

  members: Member[];
}

export type ProjectsResponse = {
  data: Project[];
};