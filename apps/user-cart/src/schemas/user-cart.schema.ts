import Collections from '@app/common/constants/collections.constant'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { defaultSchemaOptions } from '@app/common'
import { UserCartStatus } from '../constants/user-cart.constant'
import mongoose, { HydratedDocument } from 'mongoose'
import { ICartItem, IUserCart } from '../interfaces/user-cart.interface'

export type UserCartDocument = HydratedDocument<IUserCart>
@Schema({ collection: Collections.USER_CART, ...defaultSchemaOptions })
export class UserCartModelSchema {
	@Prop({ type: String, enum: Object.values(UserCartStatus), default: UserCartStatus.ACTIVE })
	status: UserCartStatus

	@Prop({ type: Array, required: true, default: [] })
	items: Array<ICartItem>

	@Prop({ type: Number, required: true, min: 0, default: 0 })
	items_count: number

	@Prop({ type: mongoose.Types.ObjectId, required: true })
	created_by: mongoose.Types.ObjectId
}

export const UserCartSchema = SchemaFactory.createForClass(UserCartModelSchema)
