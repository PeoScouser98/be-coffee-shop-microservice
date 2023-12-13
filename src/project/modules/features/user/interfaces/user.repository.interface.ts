import { IBaseRepository } from '@/project/modules/base/repositories/base.interface.repository'
import { IUser } from './user.interface'

export declare interface IUserRepository extends IBaseRepository<IUser> {
	findUserByEmail(email: string): Promise<IUser>
	createUser(payload: Omit<IUser, '_id'>): Promise<IUser>
}
