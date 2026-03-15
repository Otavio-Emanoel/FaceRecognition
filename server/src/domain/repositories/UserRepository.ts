import User from '../entities/User'

export interface IUserRepository {
    save(user: User): Promise<User>
    findAll(): Promise<User[]>
}

export default IUserRepository
