import { getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { UserRoles } from '../constants/user.constant'
import { IUser } from '../interfaces/user.interface'

export type UserDocument = HydratedDocument<IUser> & {
	authenticate: (password: string) => boolean
}

const COLLECTION_NAME = 'users' as const
@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class User {
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
export const UserSchema = SchemaFactory.createForClass(User)
