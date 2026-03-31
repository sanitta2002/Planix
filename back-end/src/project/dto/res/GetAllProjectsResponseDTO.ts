import { PaginationDTO } from './PaginationDTO';
import { ProjectListItemDto } from './ProjectListItemDto';

export class GetAllProjectsResponseDTO {
  data: ProjectListItemDto[];
  pagination: PaginationDTO;
}
