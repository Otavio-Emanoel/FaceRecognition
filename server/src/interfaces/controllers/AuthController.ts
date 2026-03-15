import { Request, Response } from 'express'
import RegisterUser from '../../application/use-cases/RegisterUser'
import LoginUser from '../../application/use-cases/LoginUser'

export default class AuthController {
    private registerUser: RegisterUser
    private loginUser: LoginUser

    constructor(registerUser: RegisterUser, loginUser: LoginUser) {
        this.registerUser = registerUser
        this.loginUser = loginUser
    }

    async register(req: Request, res: Response) {
        const { name, email, password, descriptor } = req.body as {
            name?: string
            email?: string
            password?: string
            descriptor?: any
        }

        if (!name || !email || !password || !Array.isArray(descriptor)) {
            return res.status(400).json({ error: 'Invalid input. name, email, password and descriptor are required.' })
        }

        if (!descriptor.every((v: any) => typeof v === 'number')) {
            return res.status(400).json({ error: 'Descriptor must be an array of numbers.' })
        }

        try {
            const user = await this.registerUser.execute(name, email, password, descriptor)
            res.status(201).json(user)
        } catch (error) {
            console.error('Register error:', error)
            res.status(500).json({ error: 'Failed to register user' })
        }
    }

    async login(req: Request, res: Response) {
        const { descriptor } = req.body as { descriptor?: any }

        if (!Array.isArray(descriptor) || !descriptor.every((v: any) => typeof v === 'number')) {
            return res.status(400).json({ error: 'Descriptor (array of numbers) is required.' })
        }

        try {
            const user = await this.loginUser.execute(descriptor)
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(401).json({ error: 'Invalid credentials' })
            }
        } catch (error) {
            console.error('Login error:', error)
            res.status(500).json({ error: 'Failed to login user' })
        }
    }
}