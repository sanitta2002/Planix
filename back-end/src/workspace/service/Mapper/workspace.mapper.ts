import { WorkspaceResponseDto } from 'src/workspace/dto/res/WorkspaceResponseDto';
import { WorkspaceDocument } from 'src/workspace/Model/workspace.schema';
type Owner = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export class WorkspaceMapper {
  static toResponseDto(
    workspace: WorkspaceDocument,
    logoUrl?: string | null,
  ): WorkspaceResponseDto {
    const owner: Owner = workspace.ownerId as unknown as Owner;
    return {
      id: workspace._id.toString(),
      name: workspace.name,
      description: workspace.description,
      ownerId: {
        id: owner._id.toString(),
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
      },
      members: workspace.members?.map((m) => m.toString()),
      subscriptionId: workspace.subscriptionId?.toString(),
      logo: workspace.logo,
      logoUrl: logoUrl ?? null,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      subscriptionStatus: workspace.subscriptionStatus,
    };
  }
}
