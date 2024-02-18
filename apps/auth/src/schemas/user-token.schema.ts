import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { IUserToken } from '../interfaces/user-token.interface'

export type UserTokenDocument = HydratedDocument<IUserToken>

const COLLECTION_NAME = 'user_tokens' as const
@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class UserToken extends BaseAbstractSchema {
	@Prop({
		type: mongoose.Types.ObjectId,
		required: true,
		transform: (value) => value.toString()
	})
	user: string

	@Prop({
		type: String,
		trim: true,
		unique: true
	})
	public_key: string

	@Prop({
		type: String,
		trim: true,
		unique: true
	})
	private_key: string

	@Prop({
		type: String,
		trim: true,
		unique: true
	})
	refresh_token: string

	@Prop({ type: Array, required: true, trim: true, default: [] })
	used_refresh_tokens: Array<string>
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken)
