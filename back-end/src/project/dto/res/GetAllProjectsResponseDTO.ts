import { PaginationDTO } from '@/project/dto/res/PaginationDTO';
import { ProjectListItemDto } from '@/project/dto/res/ProjectListItemDto';

export class GetAllProjectsResponseDTO {
  data: ProjectListItemDto[];
  pagination: PaginationDTO;
}
