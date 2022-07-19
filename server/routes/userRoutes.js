import express from 'express'
import Controller from '../controllers/UserController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

const c = new Controller()
// Basic Crud routes
router.get('/customers', auth(1), c.clientIndex())
router.post('/', auth(0), c.createClient())

export default router
