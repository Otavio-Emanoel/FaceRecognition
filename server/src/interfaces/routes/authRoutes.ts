import { Router } from 'express'
import AuthController from '../controllers/AuthController'

export default function authRoutes(controller: AuthController) {
    const router = Router()

    router.post('/register', (req, res) => controller.register(req, res))
    router.post('/login', (req, res) => controller.login(req, res))

    return router
}
