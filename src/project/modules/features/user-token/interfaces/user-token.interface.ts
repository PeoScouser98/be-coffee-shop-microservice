import { Types } from 'mongoose'
import { IUser } from '../../user/interfaces/user.interface'

export declare interface IUserToken {
	user: Types.ObjectId | Partial<IUser>
	publicKey: string
	privateKey: string
	refreshToken: string
	usedRefreshTokens: Array<string>
}
