import express from 'express'
import { addExpenses, deleteExpense, getExpenseByGroupId } from '../controllers/expenseController'

const router = express.Router()
router.post('/expenses', addExpenses)
router.get('/getExpense/:groupId', getExpenseByGroupId)
router.delete('/expense/:groupId/:expenseId',deleteExpense)

export default router