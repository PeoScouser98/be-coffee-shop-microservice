import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { IUserToken } from '../interfaces/user-token.interface'
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import Collections from '@/project/common/constants/collections.constant'
import { UserSchema } from '../../user/schemas/user.schema'

export type UserTokenDocument = HydratedDocument<IUserToken>

@Schema({
	timestamps: true,
	versionKey: false,
	collection: Collections.USER_TOKENS,
	expires: '30d'
})
export class UserToken {
	@Prop({
		type: mongoose.Types.ObjectId,
		required: true,
		validators: [IsMongoId]
	})
	user: string

	@Prop({
		type: String,
		trim: true,
		unique: true,
		validators: [IsString, IsNotEmpty]
	})
	publicKey: string

	@Prop({
		type: String,
		trim: true,
		unique: true,
		validators: [IsString, IsNotEmpty]
	})
	privateKey: string

	@Prop({
		type: String,
		trim: true,
		unique: true,
		validators: [IsString, IsNotEmpty]
	})
	refreshToken: string

	@Prop({ type: Array, required: true, trim: true, default: [] })
	usedRefreshTokens: Array<string>
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken)
