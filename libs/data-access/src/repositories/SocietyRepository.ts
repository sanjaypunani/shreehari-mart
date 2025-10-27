import { Repository } from 'typeorm';
import { Society } from '../entities/Society';
import { AppDataSource } from '../database/config';

export class SocietyRepository {
  private repository: Repository<Society>;

  constructor() {
    this.repository = AppDataSource.getRepository(Society);
  }

  async findAll(): Promise<Society[]> {
    return this.repository.find({
      relations: ['buildings'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Society | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['buildings'],
    });
  }

  async findByName(name: string): Promise<Society | null> {
    return this.repository.findOne({
      where: { name },
    });
  }

  async create(societyData: {
    name: string;
    address: string;
  }): Promise<Society> {
    const society = this.repository.create(societyData);
    return this.repository.save(society);
  }

  async update(
    id: string,
    societyData: Partial<Society>
  ): Promise<Society | null> {
    await this.repository.update(id, societyData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
