import { IBaseRepository } from 'src/modules/shared/repositories/base.interface.repository';
import { IUser } from './user.interface';

export interface IUserRepository extends IBaseRepository<IUser> {
	findUserByEmail(email: string): Promise<IUser>;
	createUser(payload: Omit<IUser, '_id'>): Promise<IUser>;
}
