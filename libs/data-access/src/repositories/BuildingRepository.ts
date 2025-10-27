import { Repository } from 'typeorm';
import { Building } from '../entities/Building';
import { AppDataSource } from '../database/config';

export class BuildingRepository {
  private repository: Repository<Building>;

  constructor() {
    this.repository = AppDataSource.getRepository(Building);
  }

  async findAll(options?: { societyId?: string }): Promise<Building[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('building')
      .leftJoinAndSelect('building.society', 'society')
      .orderBy('building.name', 'ASC');

    if (options?.societyId) {
      queryBuilder.andWhere('building.societyId = :societyId', {
        societyId: options.societyId,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Building | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['society'],
    });
  }

  async findBySocietyId(societyId: string): Promise<Building[]> {
    return this.repository.find({
      where: { societyId },
      relations: ['society'],
      order: { name: 'ASC' },
    });
  }

  async create(buildingData: {
    societyId: string;
    name: string;
  }): Promise<Building> {
    const building = this.repository.create(buildingData);
    return this.repository.save(building);
  }

  async update(
    id: string,
    buildingData: Partial<Building>
  ): Promise<Building | null> {
    await this.repository.update(id, buildingData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async count(societyId?: string): Promise<number> {
    if (societyId) {
      return this.repository.count({ where: { societyId } });
    }
    return this.repository.count();
  }
}
