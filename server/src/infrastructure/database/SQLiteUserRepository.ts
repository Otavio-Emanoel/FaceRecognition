import sqlite3 from 'sqlite3';

class SQLiteUserRepository {
    constructor() {
        this.db = new sqlite3.Database("./database.db")
    }

    async save(user: any) {
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

    findAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM users`

            this.db.all(query, [], (err: any, rows: any[]) => {
                if (err) {
                    reject(err)
                } else {
                    const users = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        email: row.email,
                        password: row.password,
                        descriptor: JSON.parse(row.descriptor)
                    }))
                    resolve(users)
                }
            })
        })
    }
}

module.exports = SQLiteUserRepository;