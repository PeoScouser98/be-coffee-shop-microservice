import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<IUser>;

export enum UserRoleEnum {
	ADMIN,
	STAFF,
	CUSTOMER
}

const COLLECTION_NAME: string = 'users';

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
	email: string;

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	password: string;

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	displayName: string;

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	address: string;

	@Prop({
		type: Boolean,
		required: true,
		default: false
	})
	verified: boolean;

	@Prop({
		required: true,
		enum: Object.values(UserRoleEnum).filter((val) => !isNaN(Number(val))),
		default: UserRoleEnum.CUSTOMER
	})
	role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
