import { BaseRepository } from 'src/users/repository/BaseRepo/BaseRepo';
import { Issue, IssueDocument } from '../Model/issue.schema';
import { IIssueRepository } from '../interface/IIssueRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IssueStatus } from 'src/common/type/IssueStatus';

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
  async findByParent(parentId: string): Promise<IssueDocument[]> {
    return await this._IssueModel.find({
      parentId: new Types.ObjectId(parentId),
    });
  }
  async findByStatus(status: IssueStatus): Promise<IssueDocument[]> {
    return this._IssueModel.find({ status }).exec();
  }
}
