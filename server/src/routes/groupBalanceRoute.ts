import express from 'express'
import { getGroupBalance } from '../controllers/groupBalanceController'

const router = express.Router()
router.get('/group/balance/:groupId', getGroupBalance)

export default router