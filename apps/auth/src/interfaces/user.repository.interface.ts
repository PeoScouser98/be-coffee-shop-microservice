import { IBaseRepository } from '@app/common'
import { IUser } from './user.interface'

export interface IUserRepository extends IBaseRepository<IUser> {
	findUserByEmail(email: string): Promise<IUser>
	createUser(payload: Omit<IUser, '_id'>): Promise<IUser>
}
