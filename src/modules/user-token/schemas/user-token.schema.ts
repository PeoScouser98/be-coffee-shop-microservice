import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUserToken } from '../interfaces/user-token.interface';

export type UserTokenDocument = HydratedDocument<IUserToken>;

const COLLECTION_NAME = 'user_tokens';

@Schema({
	timestamps: true,
	versionKey: false,
	collection: COLLECTION_NAME,
	expires: '30d'
})
export class UserToken {
	@Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'Users' })
	user: string;

	@Prop({ type: String, trim: true, unique: true })
	publicKey: string;

	@Prop({ type: Array, required: true, trim: true, default: [] })
	refreshToken: Array<string>;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
