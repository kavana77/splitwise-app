import express from 'express'
import { addUser } from '../controllers/userController'

const router = express.Router()
router.post('/groups/:groupId/members', addUser)

export default router