import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3333

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
