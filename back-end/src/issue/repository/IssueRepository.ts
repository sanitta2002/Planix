import { BaseRepository } from '@/users/repository/BaseRepo/BaseRepo';
import { Issue, IssueDocument } from '@/issue/Model/issue.schema';
import { IIssueRepository } from '@/issue/interface/IIssueRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IssueStatus } from '@/common/type/IssueStatus';

export class IssueRepository
  extends BaseRepository<IssueDocument>
  implements IIssueRepository
{
  constructor(
    @InjectModel(Issue.name) private readonly _IssueModel: Model<IssueDocument>,
  ) {
    super(_IssueModel);
  }
  async findByProject(projectId: string): Promise<IssueDocument[]> {
    return await this._IssueModel
      .find({
        projectId: new Types.ObjectId(projectId),
      })
      .lean();
  }
  async moveIncompleteIssues(
    sprintId: string,
    newSprintId: string | null,
  ): Promise<void> {
    await this._IssueModel.updateMany(
      {
        sprintId: new Types.ObjectId(sprintId),
        status: { $ne: IssueStatus.DONE },
      },
      {
        $set: {
          sprintId: newSprintId ? new Types.ObjectId(newSprintId) : null,
        },
      },
    );
  }
  async findBySprint(sprintId: string): Promise<IssueDocument[]> {
    return await this._IssueModel.find({
      sprintId: new Types.ObjectId(sprintId),
    });
  }
}
