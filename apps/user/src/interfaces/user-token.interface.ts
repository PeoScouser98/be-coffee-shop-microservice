import { IUser } from 'apps/auth/src/interfaces/user.interface'
import { Types } from 'mongoose'

export declare interface IUserToken {
	user: Types.ObjectId | Partial<IUser>
	public_key: string
	private_key: string
	refresh_token: string
	used_refresh_tokens: Array<string>
}
