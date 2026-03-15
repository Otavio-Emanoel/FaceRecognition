import express from 'express'
import cors from 'cors'

const SQLiteUserRepository = require('./infrastructure/database/SQLiteUserRepository')
const RegisterUser = require('./application/use-cases/RegisterUser')
const LoginUser = require('./application/use-cases/LoginUser')
const AuthController = require('./interfaces/controllers/AuthController')
const authRoutes = require('./interfaces/routes/authRoutes').default

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
