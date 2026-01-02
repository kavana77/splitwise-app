import express from 'express'
import { convertGroupExpenses, getGroupBalance } from '../controllers/groupBalanceController'

const router = express.Router()
router.get('/group/balance/:groupId', getGroupBalance)
router.post('/group/:groupId/convert', convertGroupExpenses)

export default router