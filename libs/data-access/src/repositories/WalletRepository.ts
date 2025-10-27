import { Repository, EntityManager } from 'typeorm';
import { Wallet } from '../entities/Wallet';
import {
  WalletTransaction,
  WalletTransactionType,
} from '../entities/WalletTransaction';
import { AppDataSource } from '../database/config';

export class WalletRepository {
  private repository: Repository<Wallet>;
  private transactionRepository: Repository<WalletTransaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(Wallet);
    this.transactionRepository = AppDataSource.getRepository(WalletTransaction);
  }

  async findByCustomerId(customerId: string): Promise<Wallet | null> {
    return this.repository.findOne({
      where: { customerId },
      relations: ['customer'],
    });
  }

  async createWalletForCustomer(customerId: string): Promise<Wallet> {
    const wallet = this.repository.create({
      customerId,
      balance: 0,
    });
    return this.repository.save(wallet);
  }

  async addFunds(
    customerId: string,
    amount: number,
    description: string
  ): Promise<{ wallet: Wallet; transaction: WalletTransaction }> {
    return AppDataSource.transaction(async (manager: EntityManager) => {
      // Get wallet
      let wallet = await manager.findOne(Wallet, { where: { customerId } });

      if (!wallet) {
        wallet = manager.create(Wallet, { customerId, balance: 0 });
        wallet = await manager.save(wallet);
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error('Amount must be positive');
      }

      // Update balance
      wallet.balance = Number(wallet.balance) + Number(amount);
      await manager.save(wallet);

      // Create transaction
      const transaction = manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount,
        type: WalletTransactionType.CREDIT,
        description,
      });
      const savedTransaction = await manager.save(transaction);

      return { wallet, transaction: savedTransaction };
    });
  }

  async deductFunds(
    customerId: string,
    amount: number,
    description: string
  ): Promise<{ wallet: Wallet; transaction: WalletTransaction }> {
    return AppDataSource.transaction(async (manager: EntityManager) => {
      // Get wallet
      const wallet = await manager.findOne(Wallet, { where: { customerId } });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error('Amount must be positive');
      }

      if (Number(wallet.balance) < Number(amount)) {
        throw new Error('Insufficient balance');
      }

      // Update balance
      wallet.balance = Number(wallet.balance) - Number(amount);
      await manager.save(wallet);

      // Create transaction
      const transaction = manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount,
        type: WalletTransactionType.DEBIT,
        description,
      });
      const savedTransaction = await manager.save(transaction);

      return { wallet, transaction: savedTransaction };
    });
  }

  async getTransactionHistory(
    customerId: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const { page = 1, limit = 20 } = options || {};

    const wallet = await this.repository.findOne({ where: { customerId } });
    if (!wallet) {
      return { transactions: [], total: 0 };
    }

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { walletId: wallet.id },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      }
    );

    return { transactions, total };
  }

  async getBalance(customerId: string): Promise<number> {
    const wallet = await this.repository.findOne({ where: { customerId } });
    return wallet?.balance || 0;
  }
}
