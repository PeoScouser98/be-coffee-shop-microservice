import mongoose from 'mongoose';

export declare interface IUserToken {
	user: string | mongoose.Types.ObjectId;
	publicKey: string;
	refreshToken: Array<string>;
}
