import { Repository } from 'typeorm';
import { DeliveryPartner } from '../entities/DeliveryPartner';
import { AppDataSource } from '../database/config';

export class DeliveryPartnerRepository {
  private repository: Repository<DeliveryPartner>;

  constructor() {
    this.repository = AppDataSource.getRepository(DeliveryPartner);
  }

  /**
   * Returns all delivery partners ordered by name ASC.
   */
  async findAll(): Promise<DeliveryPartner[]> {
    return this.repository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Returns only active delivery partners ordered by name ASC.
   */
  async findActive(): Promise<DeliveryPartner[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Returns a single delivery partner by primary key, or null if not found.
   */
  async findById(id: string): Promise<DeliveryPartner | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Creates and returns a new delivery partner.
   */
  async create(data: {
    name: string;
    mobileNumber: string;
    isActive?: boolean;
  }): Promise<DeliveryPartner> {
    const partner = this.repository.create(data);
    return this.repository.save(partner);
  }

  /**
   * Updates an existing delivery partner and returns the updated record, or null if not found.
   */
  async update(
    id: string,
    data: Partial<Pick<DeliveryPartner, 'name' | 'mobileNumber' | 'isActive'>>
  ): Promise<DeliveryPartner | null> {
    const partner = await this.findById(id);
    if (!partner) {
      return null;
    }
    this.repository.merge(partner, data);
    await this.repository.save(partner);
    return this.findById(id);
  }

  /**
   * Hard-deletes a delivery partner.
   * Returns true if a row was deleted, false if not found.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected! > 0;
  }
}
