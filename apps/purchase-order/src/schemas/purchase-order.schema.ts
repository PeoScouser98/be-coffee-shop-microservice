import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common/base/base.abstract.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Product } from 'apps/product/src/schemas/product.schema'
import mongoose, { HydratedDocument } from 'mongoose'
import { PaymentMethod, PurchaseOrderStatus } from '../constants/purchase-order.const'
import { IPurchaseOrder } from '../interfaces/purchase-order.interface'

export type PurchaseOrderDocument = HydratedDocument<IPurchaseOrder>

const COLLECTION_NAME = 'purchase_orders' as const

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class PurchaseOrder extends BaseAbstractSchema {
	@Prop({ type: String, required: true })
	customer_email: string

	@Prop({ type: String, required: true })
	customer_phone: string

	@Prop({ type: Array, required: true, ref: Product.name })
	purchase_items: Array<{
		product_id: mongoose.Types.ObjectId
		product_name: string
		product_thumbnail: string
		purchased_quantity: number
	}>

	@Prop({ type: Object, required: true })
	purchase_order_checkout: {
		total_amount: number
		total_discount: number
		fee_ship: number
	}

	@Prop({ type: String, enum: Object.values(PaymentMethod), required: true })
	payment_method: PaymentMethod

	@Prop({ type: Object, required: true })
	shipping_address: {
		city: string
		district: string
		ward: string
		specific_address: string
	}

	@Prop({ type: String, default: null })
	shipping_tracking_number: string | null

	@Prop({
		type: String,
		enum: Object.values(PurchaseOrderStatus),
		default: PurchaseOrderStatus.PENDING
	})
	status: PurchaseOrderStatus
}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder)
