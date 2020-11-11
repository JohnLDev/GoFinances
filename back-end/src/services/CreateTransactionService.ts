import { getCustomRepository, getRepository } from 'typeorm'
import AppError from '../errors/AppError'
import Category from '../models/Category'
import Transaction from '../models/Transaction'
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Request {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

class CreateTransactionService {
  public async excute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category)
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const categoryExist = await categoriesRepository.findOne({
      where: { title: category },
    })
    const balance = await transactionsRepository.getBalance()

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('you do not have enough balance')
    }
    if (!categoryExist) {
      const newCategory = categoriesRepository.create({
        title: category,
      })
      await categoriesRepository.save(newCategory)
    }

    const getCategory = await categoriesRepository.findOneOrFail({
      where: {
        title: category,
      },
    })
    const transaction = transactionsRepository.create({
      title: title,
      type: type,
      value: value,
      category_id: getCategory.id,
    })
    await transactionsRepository.save(transaction)
    return transaction
  }
}

export default CreateTransactionService
