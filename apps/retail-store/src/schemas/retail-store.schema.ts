import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { RetailStoreTypeEnum, Cities } from '../constants/retail-store.constant'
import { IRetailStore } from '../interfaces/retail-store.interface'
import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'

export type RetailStoreDocument = HydratedDocument<IRetailStore>

const COLLECTION_NAME = 'retail_stores' as const

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions
})
export class RetailStore extends BaseAbstractSchema {
	// Tên cửa hàng
	@Prop({ type: String, required: true, trim: true })
	name: string

	@Prop({ type: String, trim: true, slug: 'name' })
	slug: string

	// Khu vực tỉnh thành
	@Prop({ type: String, required: true, trim: true, enum: Cities })
	area: string

	// Địa chỉ chi tiết ({apartment_num}/{street_name}/{district_name})
	@Prop({ type: String, required: true, trim: true })
	address: string

	// Hotline cửa hàng
	@Prop({ type: String, required: true, trim: true, unique: true })
	hotline: string

	// Loại hình cửa hàng
	@Prop({
		type: String,
		required: true,
		trim: true,
		index: true,
		enum: Object.values(RetailStoreTypeEnum)
	})
	store_type: RetailStoreTypeEnum

	// Thời gian mở cửa
	@Prop({ type: String, required: true, trim: true, lowercase: true })
	open_time: string

	// Thời gian mở cửa
	@Prop({ type: String, required: true, trim: true, lowercase: true })
	close_time: string

	// Tọa độ google map
	@Prop({
		type: Object,
		default: null
	})
	google_map_coordinate: Record<'latitude' | 'longtitude', number>
}

export const RetailStoreSchema = SchemaFactory.createForClass(RetailStore)
