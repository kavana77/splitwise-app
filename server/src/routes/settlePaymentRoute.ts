import express from 'express'
import { settlePayment } from '../controllers/settlePaymentController'

const router = express.Router()
router.post('/settlement', settlePayment)

export default router