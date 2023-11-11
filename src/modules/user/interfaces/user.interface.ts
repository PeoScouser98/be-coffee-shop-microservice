import mongoose from 'mongoose';
import { UserRoleEnum } from '../schemas/user.schema';

export declare interface IUser {
	_id: string | mongoose.Types.ObjectId;
	email: string;
	password: string;
	displayName: string;
	phone: string;
	address: string;
	verified: boolean;
	role: number;
	encryptPassword: (password: string) => string;
	authenticate: (password: string) => boolean;
}
