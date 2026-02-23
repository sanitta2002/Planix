import { WorkspaceResponseDto } from 'src/workspace/dto/res/WorkspaceResponseDto';
import { WorkspaceDocument } from 'src/workspace/Model/workspace.schema';

export class WorkspaceMapper {
  static toResponseDto(workspace: WorkspaceDocument): WorkspaceResponseDto {
    return {
      id: workspace._id.toString(),
      name: workspace.name,
      description: workspace.description,
      ownerId: workspace.ownerId?.toString(),
      members: workspace.members?.map((m) => m.toString()),
      subscriptionId: workspace.subscriptionId?.toString(),
      logo: workspace.logo,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }
}
