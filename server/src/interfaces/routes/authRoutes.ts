import { Router } from 'express'

export default function authRoutes(controller: any) {
    const router = Router()

    router.post('/register', (req, res) => controller.register(req, res))
    router.post('/login', (req, res) => controller.login(req, res))

    return router
}
