import { Types } from 'mongoose'
import { UserRoles } from '../constants/user.constant'

export interface IUser {
	_id: Types.ObjectId
	email: string
	password: string
	display_name: string
	phone: string
	address: string
	verified: boolean
	role: UserRoles
}
