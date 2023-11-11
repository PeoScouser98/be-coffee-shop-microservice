import { Types } from 'mongoose';
import { IUserToken } from '../interfaces/user-token.interface';

export class UserTokenDTO implements IUserToken {
	expires: string;
	user: string | Types.ObjectId;
	publicKey: string;
	refreshToken: Array<string>;
}
