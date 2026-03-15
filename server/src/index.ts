import express from 'express'
import cors from 'cors'

import SQLiteUserRepository from './infrastructure/database/SQLiteUserRepository'
import RegisterUser from './application/use-cases/RegisterUser'
import LoginUser from './application/use-cases/LoginUser'
import AuthController from './interfaces/controllers/AuthController'
import authRoutes from './interfaces/routes/authRoutes'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3333

const userRepository = new SQLiteUserRepository()
const registerUser = new RegisterUser(userRepository)
const loginUser = new LoginUser(userRepository)
const authController = new AuthController(registerUser, loginUser)

app.use('/auth', authRoutes(authController))

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
})

// Dev helper: list users (not for production)
app.get('/debug/users', async (req, res) => {
  try {
    const users = await userRepository.findAll()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Failed to read users from DB', details: String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
