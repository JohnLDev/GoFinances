import { getCustomRepository } from 'typeorm'
import AppError from '../errors/AppError'
import TransactionsRepository from '../repositories/TransactionsRepository'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository)
    const transactionExist = transactionRepository.findOne({
      where: { id: id },
    })
    if (!transactionExist) {
      throw new AppError('Transaction does not exist', 404)
    }
    await transactionRepository.delete(id)
  }
}

export default DeleteTransactionService
