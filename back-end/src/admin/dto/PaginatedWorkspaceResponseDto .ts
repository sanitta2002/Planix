import { WorkspaceResponseDto } from '../../workspace/dto/res/WorkspaceResponseDto';

export class PaginatedWorkspaceResponseDto {
  data: WorkspaceResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
