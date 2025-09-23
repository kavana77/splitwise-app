import express from 'express'
import { addExpenses } from '../controllers/expenseController'

const router = express.Router()
router.post('/expenses', addExpenses)

export default router