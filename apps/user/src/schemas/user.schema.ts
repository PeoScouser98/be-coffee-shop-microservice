import Collections from '@app/common/constants/collections.constant'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import UserRoles from '../constants/user.constant'
import { defaultSchemaOptions } from '@app/common'

export type UserDocument = HydratedDocument<IUser>

@Schema({
	collection: Collections.USERS,
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
	displayName: string

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
