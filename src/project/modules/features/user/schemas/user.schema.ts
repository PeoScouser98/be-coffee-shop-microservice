import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import UserRoles from '@/project/modules/features/user/constants/user-roles.constant'

export type UserDocument = HydratedDocument<IUser>

const COLLECTION_NAME: string = 'users'

@Schema({
	timestamps: true,
	versionKey: false,
	strictQuery: false,
	collection: COLLECTION_NAME
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
export const UserSchema = SchemaFactory.createForClass(User)
