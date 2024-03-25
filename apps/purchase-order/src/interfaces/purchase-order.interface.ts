import mongoose from 'mongoose'
import { PaymentMethod, PurchaseOrderStatus } from '../constants/purchase-order.const'

export interface IPurchaseOrder {
	customer_email: string
	customer_phone: string
	purchased_items: Array<{
		product_id: mongoose.Types.ObjectId
		product_name: string
		product_thumbnail: string
		purchased_quantity: number
	}>
	purchase_order_checkout: {
		total_amount: number
		total_discount: number
		fee_ship: number
	}
	payment_method: PaymentMethod
	shipping_address: {
		city: string
		district: string
		ward: string
		specific_address: string
	}
	shipping_tracking_number: string | null
	status: PurchaseOrderStatus
}
