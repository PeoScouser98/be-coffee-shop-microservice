import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { getDefaultSchemaOptions } from '@app/common'
import { ShoppingCartStatus } from '../constants/shopping-cart.constant'
import mongoose, { HydratedDocument } from 'mongoose'
import { ICartItem, IShoppingCart } from '../interfaces/shopping-cart.interface'

export type ShoppingCartDocument = HydratedDocument<IShoppingCart>

const COLLECTION_NAME = 'shopping_carts'

@Schema({ collection: COLLECTION_NAME, ...getDefaultSchemaOptions })
export class UserCartModelSchema {
	@Prop({
		type: String,
		enum: Object.values(ShoppingCartStatus),
		default: ShoppingCartStatus.ACTIVE
	})
	status: ShoppingCartStatus

	@Prop({ type: Array, required: true, default: [] })
	items: Array<ICartItem>

	@Prop({ type: Number, required: true, min: 0, default: 0 })
	items_count: number

	@Prop({ type: mongoose.Types.ObjectId, required: true })
	created_by: mongoose.Types.ObjectId
}

export const UserCartSchema = SchemaFactory.createForClass(UserCartModelSchema)
