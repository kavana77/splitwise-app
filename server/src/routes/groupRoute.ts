import express from 'express'
import { addGroup, getAllGroups, getGroupById,  } from '../controllers/groupController'

const router = express.Router()
router.post('/newGroup', addGroup)
router.get('/groups',getAllGroups)
router.get('/group/:groupId', getGroupById)

export default router