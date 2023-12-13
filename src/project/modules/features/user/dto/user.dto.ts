import mongoose, { Types } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	Min,
	MinLength
} from 'class-validator'
import UserRoles from '@/project/modules/features/user/constants/user-roles.constant'

export class UserDTO {
	@IsMongoId()
	_id: Types.ObjectId

	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string

	@IsString()
	@IsPhoneNumber('VI')
	@IsNotEmpty()
	phone: string

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	displayName: string

	@IsNotEmpty()
	@IsString()
	address: string

	@IsBoolean()
	verified: boolean

	@IsEnum(UserRoles)
	role: UserRoles

	encryptPassword: (password: string) => string
	authenticate: (password: string) => boolean
}
