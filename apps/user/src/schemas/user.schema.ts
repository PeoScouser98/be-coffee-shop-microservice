import { defaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { USER_COLLECTION, UserRoles } from '../constants/user.constant'
import { IUser } from '../interfaces/user.interface'

export type UserDocument = HydratedDocument<IUser> & {
	encryptPassword: (password: string) => string
	authenticate: (password: string) => boolean
}

@Schema({
	collection: USER_COLLECTION,
	...defaultSchemaOptions
})
export class UserModelSchema {
	@Prop({
		type: String,
		required: true,
		trim: true,
		unique: true,
		index: true,
		match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
	})
	email: string

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	password: string

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	display_name: string

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	address: string

	@Prop({
		type: Boolean,
		required: true,
		default: false
	})
	verified: boolean

	@Prop({
		type: String,
		required: true,
		enum: Object.values(UserRoles).filter((val) => !isNaN(Number(val))),
		default: UserRoles.CUSTOMER
	})
	role: UserRoles
}
export const UserSchema = SchemaFactory.createForClass(UserModelSchema)
