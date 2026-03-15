import sqlite3 from 'sqlite3'
import User from '../../domain/entities/User'
import { IUserRepository } from '../../domain/repositories/UserRepository'

export default class SQLiteUserRepository implements IUserRepository {
    private db: sqlite3.Database

    constructor() {
        this.db = new sqlite3.Database('./database.db')
        this.ensureTable()
    }

    private ensureTable() {
        const create = `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            password TEXT,
            descriptor TEXT
        )`
        this.db.run(create)
    }

    async save(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users (id, name, email, password, descriptor) VALUES (?, ?, ?, ?, ?)`

            this.db.run(query, [user.id, user.name, user.email, user.password, JSON.stringify(user.descriptor)], function (err: any) {
                if (err) {
                    reject(err)
                } else {
                    resolve(user)
                }
            })
        })
    }

    async findAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users`

            this.db.all(query, [], (err: any, rows: any[]) => {
                if (err) {
                    reject(err)
                } else {
                    const users = rows.map(row => new User(row.id, row.name, row.email, row.password, JSON.parse(row.descriptor)))
                    resolve(users)
                }
            })
        })
    }
}