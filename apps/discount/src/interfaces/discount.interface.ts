import mongoose from 'mongoose'
import { DiscountTypeEnum } from '../constants/discount.contant'

export interface IDiscount {
	name: Record<'vi' | 'en', string>
	discount_type: DiscountTypeEnum
	discount_code: string
	start_date: Date
	endDate: Date
	applied_for_products: Array<mongoose.Types.ObjectId>
	quantity: number
	max_use_times: number
	discount_value: number
	min_order_value: number
	used_by: Array<mongoose.Types.ObjectId>
	is_active: boolean
}
