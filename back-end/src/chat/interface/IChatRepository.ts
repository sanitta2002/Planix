import { IBaseRepository } from '@/users/interfaces/baseRepo.interface';
import { MessageDocument } from '@/chat/Model/message.schema';

export interface IChatRepository extends IBaseRepository<MessageDocument> {
  findByProject(
    projectId: string,
    limit: number,
    offset: number,
  ): Promise<MessageDocument[]>;
  countByProject(projectId: string): Promise<number>;
}
