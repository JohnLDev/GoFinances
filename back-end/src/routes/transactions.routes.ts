import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import TransactionRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'
import DeleteTransactionService from '../services/DeleteTransactionService'
import multer from 'multer'
import ImportTransactionService from '../services/ImportTransactionService'
import UploadConfig from '../config/upload'

const uploadConfig = multer(UploadConfig)

const transactionsRouter = Router()

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionRepository)
  const transactions = await transactionRepository.find()
  const balance = await transactionRepository.getBalance()
  return response.status(200).json({
    transactions,
    balance,
  })
})

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body
  const createTransactionService = new CreateTransactionService()
  const transaction = await createTransactionService.excute({
    title,
    type,
    value,
    category,
  })
  return response.status(201).json(transaction)
})

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const deleteTransactionService = new DeleteTransactionService()
  await deleteTransactionService.execute(id)
  return response.status(204).json()
})

transactionsRouter.post(
  '/import',
  uploadConfig.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionService()
    const transactions = await importTransactionService.execute(
      request.file.path,
    )
    return response.status(201).json(transactions)
  },
)

export default transactionsRouter
