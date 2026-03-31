interface Member {
  user: {
    id: string;
    firstName: string;
  };
  role: {
    id: string;
    name: string;
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