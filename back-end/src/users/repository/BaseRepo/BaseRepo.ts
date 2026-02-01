import { Model } from 'mongoose';
import { IBaseRepository } from 'src/users/interfaces/baseRepo.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected constructor(protected readonly model: Model<T>) {}
  async create(data: Partial<T>): Promise<T> {
    console.log('data', data);
    return await this.model.create(data);
  }
  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }
  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteById(id: string): Promise<boolean | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
