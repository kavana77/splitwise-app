import express from 'express'
import { getGroupBalance } from '../controllers/groupBalanceController'

const router = express.Router()
router.get('/group/:groupName/balance', getGroupBalance)

export default router