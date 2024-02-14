import { Types } from 'mongoose'
import UserRoles from '../constants/user.constant'

export declare interface IUser {
	_id: Types.ObjectId
	email: string
	password: string
	display_name: string
	phone: string
	address: string
	verified: boolean
	role: UserRoles
	encryptPassword: (password: string) => string
	authenticate: (password: string) => boolean
}
