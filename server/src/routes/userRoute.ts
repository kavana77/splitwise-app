import express from 'express'
import { creatUser } from '../controllers/userController'

const router = express.Router()
router.post('/users', creatUser)

export default router