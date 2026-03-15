import User from '../../domain/entities/User'
import { IUserRepository } from '../../domain/repositories/UserRepository'

export default class RegisterUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(name: string, email: string, password: string, descriptor: number[]): Promise<User> {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const user = new User(id, name, email, password, descriptor)
        await this.userRepository.save(user)
        return user
    }
}