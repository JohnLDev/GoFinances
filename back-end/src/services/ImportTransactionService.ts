import Transaction from '../models/Transaction'
import fs from 'fs'
import csvParse from 'csv-parse'
import { getCustomRepository, getRepository, In } from 'typeorm'
import Category from '../models/Category'
import TransactionsRepository from '../repositories/TransactionsRepository'

interface ImportResquest {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

class ImportTransactionService {
  public async execute(filepath: string): Promise<Transaction[]> {
    const readCSVStream = fs.createReadStream(filepath)
    const parseStream = csvParse({
      from_line: 2,
    })
    const categories: string[] = []
    const transactions: ImportResquest[] = []

    const parseCSV = readCSVStream.pipe(parseStream)
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      )
      if (!title || !type || !value || !category) return

      transactions.push({ title, type, value, category })
      categories.push(category)
    })
    await new Promise(resolve => parseCSV.on('end', resolve))

    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)
    const existentCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    })
    const existentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    )

    const addCategoriesTitle = categories
      .filter(category => !existentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index)
    const newCategories = categoriesRepository.create(
      addCategoriesTitle.map(title => ({ title })),
    )
    await categoriesRepository.save(newCategories)

    const finalCategories = [...existentCategories, ...newCategories]

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category_id: finalCategories.find(
          category => category.title === transaction.category,
        )?.id,
      })),
    )

    await transactionRepository.save(createdTransactions)

    fs.promises.unlink(filepath)
    return createdTransactions
  }
}

export default ImportTransactionService
