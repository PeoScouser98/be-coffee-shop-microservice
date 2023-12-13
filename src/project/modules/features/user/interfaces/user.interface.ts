import UserRoles from '@/project/modules/features/user/constants/user-roles.constant'
import { Types } from 'mongoose'

export declare interface IUser {
	_id: Types.ObjectId
	email: string
	password: string
	displayName: string
	phone: string
	address: string
	verified: boolean
	role: UserRoles
	encryptPassword: (password: string) => string
	authenticate: (password: string) => boolean
}
