import { Collections } from '@app/common'
import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { IDiscount } from '../interfaces/discount.interface'
import { DiscountApplyingMethod, DiscountTypeEnum } from '../constants/discount.contant'
import { ProductModelSchema } from 'apps/product/src/schemas/product.schema'

export type DiscountDocument = HydratedDocument<IDiscount>
@Schema({ collection: Collections.DISCOUNTS, ...defaultSchemaOptions })
export class DiscountModelSchema extends BaseAbstractDocument {
	// Tên chương trình giảm giá
	@Prop({ type: Object, required: true, trim: true })
	name: Record<'vi' | 'en', string>

	// Cách thức triết khấu
	@Prop({ type: String, required: true, enum: Object.values(DiscountTypeEnum) })
	discount_type: string

	// Mã giảm giá
	@Prop({ type: String, required: true, trim: true })
	discount_code: string

	// Thời gian bắt đầu chương trình giảm giá
	@Prop({ type: Date, required: true })
	start_date: Date

	// Thời gian kết thúc chương trình giảm giá
	@Prop({ type: Date, required: true })
	end_date: Date

	// Áp dụng mã giảm giá cho nhóm sản phẩm
	@Prop({
		type: String,
		ref: ProductModelSchema.name,
		enum: DiscountApplyingMethod,
		required: true
	})
	applying_method: DiscountApplyingMethod

	// Áp dụng mã giảm giá cho nhóm sản phẩm
	@Prop({ type: Array, ref: ProductModelSchema.name, required: true })
	applied_for_products: Array<mongoose.Types.ObjectId>

	// Số lượng discount
	@Prop({ type: Number, required: true, min: 0 })
	quantity: number

	// Lượt sử dụng tối đa cho mỗi user
	@Prop({ type: Number, required: true, min: 1 })
	max_use_times: number

	// Giá trị giảm giá
	@Prop({ type: Number, required: true, min: 1000 })
	discount_value: number

	// Giá trị đơn hàng tối thiểu
	@Prop({ type: Number, required: true, min: 0 })
	min_order_value: number

	// Danh sách khách hàng đã sử dụng
	@Prop({ type: Array, default: [] })
	used_by: Array<mongoose.Types.ObjectId>

	// Trạng thái chương trình giảm giá
	@Prop({ type: Boolean, default: true })
	is_active: boolean
}

export const DiscountSchema = SchemaFactory.createForClass(DiscountModelSchema)
