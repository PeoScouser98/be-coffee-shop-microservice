import Collections from '@app/common/constants/collections.constant'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { BranchStoreTypeEnum, Cities } from '../constants/branch-store.constant'
import { IBranchStore } from '../interfaces/branch-store.interface'
import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common'

export type BranchStoreDocument = HydratedDocument<IBranchStore>

@Schema({
	collection: Collections.BRANCH_STORES,
	...defaultSchemaOptions
})
export class BranchStoreModelSchema extends BaseAbstractDocument {
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
		enum: Object.values(BranchStoreTypeEnum)
	})
	store_type: BranchStoreTypeEnum

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

export const BranchStoreSchema = SchemaFactory.createForClass(BranchStoreModelSchema)
