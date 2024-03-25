import { Types } from 'mongoose'
import { IUser } from './user.interface'

export interface IUserToken {
	user: Types.ObjectId | Partial<IUser>
	public_key: string
	private_key: string
	refresh_token: string
	used_refresh_tokens: Array<string>
}
