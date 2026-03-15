const User = require('../../domain/entities/User')

class RegisterUser {
    constructor(userRepository: any) {
        this.userRepository = userRepository;
    }

    async execute(name: string, email: string, password: string, descriptor: number[]) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const user = new User(id, name, email, password, descriptor)
        await this.userRepository.save(user)
        return user
    }
}

module.exports = RegisterUser