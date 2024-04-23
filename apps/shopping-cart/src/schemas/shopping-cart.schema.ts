import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseAbstractSchema } from '@app/common'
import { ShoppingCartStatus } from '../constants/shopping-cart.constant'
import mongoose, { HydratedDocument } from 'mongoose'
import { IShoppingCart } from '../interfaces/shopping-cart.interface'

export type ShoppingCartDocument = HydratedDocument<IShoppingCart>

const COLLECTION_NAME = 'shopping_carts'

@Schema({ collection: COLLECTION_NAME, ...BaseAbstractSchema.defaultSchemaOptions })
export class ShoppingCartModelSchema extends BaseAbstractSchema {
	@Prop({
		type: String,
		enum: Object.values(ShoppingCartStatus),
		default: ShoppingCartStatus.ACTIVE
	})
	status: ShoppingCartStatus

	@Prop({ type: Array, required: true, default: [] })
	items: Array<{ product_id: string | mongoose.Types.ObjectId; quantity: number }>

	@Prop({ type: Number, required: true, min: 0, default: 0 })
	items_count: number

	@Prop({ type: mongoose.Types.ObjectId, default: null })
	user: mongoose.Types.ObjectId | null

	@Prop({
		type: String,
		default: null
	})
	session_id: string | null
}

export const UserCartSchema = SchemaFactory.createForClass(ShoppingCartModelSchema)
