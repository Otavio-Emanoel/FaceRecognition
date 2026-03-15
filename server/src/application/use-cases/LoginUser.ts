import { IUserRepository } from '../../domain/repositories/UserRepository'
import User from '../../domain/entities/User'

function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dot = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i]
        normA += vecA[i] * vecA[i]
        normB += vecB[i] * vecB[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    if (denominator === 0) return 0

    return dot / denominator
}

class LoginUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async execute(descriptor: number[]): Promise<User | null> {
        const users: User[] = await this.userRepository.findAll()

        for (const user of users) {
            const similarity = cosineSimilarity(user.descriptor, descriptor)
            if (similarity > 0.6) {
                return user
            }
        }

        return null
    }

    async executeByCredentials(email: string, password: string): Promise<User | null> {
        const users: User[] = await this.userRepository.findAll()
        for (const user of users) {
            if (user.email === email && user.password === password) {
                return user
            }
        }
        return null
    }
}

export default LoginUser