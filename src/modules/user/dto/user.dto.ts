import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { UserRoleEnum } from '../schemas/user.schema';

export class UserDTO implements IUser {
	_id: string | mongoose.Types.ObjectId;
	email: string;
	password: string;
	phone: string;
	displayName: string;
	address: string;
	verified: boolean;
	role: number;
	encryptPassword: (password: string) => string;
	authenticate: (password: string) => boolean;
}
