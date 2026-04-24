import { Types } from 'mongoose';
import { SprintStatus } from 'src/common/type/SprintStatus';
import { CreateSprintDto } from 'src/sprint/dto/req/CreateSprintDto';
import { SprintResponse } from 'src/sprint/dto/res/SprintResponse';
import { SprintDocument } from 'src/sprint/Model/sprint.schema';

export class SprintMapper {
  static toEntity(dto: CreateSprintDto, userId: string) {
    return {
      name: dto.name,
      goal: dto.goal,
      projectId: new Types.ObjectId(dto.projectId),
      workspaceId: new Types.ObjectId(dto.workspaceId),
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: SprintStatus.PLANNED,
      createdBy: new Types.ObjectId(userId),
    };
  }

  static toResponse(sprint: SprintDocument): SprintResponse {
    return {
      _id: sprint._id.toString(),
      projectId: sprint.projectId.toString(),
      workspaceId: sprint.workspaceId.toString(),
      name: sprint.name,
      goal: sprint.goal,
      status: sprint.status,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      createdAt: sprint.createdAt,
    };
  }
}
