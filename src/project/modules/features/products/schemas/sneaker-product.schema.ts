import Collections from '@/project/common/constants/collections.constant'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import {
	AvailableSneakerSizes,
	AvailableSneakerStyles,
	ProductGender
} from '../constants/product.constant'
import { ISneakerProduct } from '../interfaces/product.interface'

declare type SneakerProductDocument = HydratedDocument<ISneakerProduct>

@Schema({
	collection: Collections.PRODUCT_SNEAKERS,
	timestamps: true,
	versionKey: false
})
class SneakerProduct {
	@Prop({
		type: [String],
		required: true,
		default: AvailableSneakerSizes
	})
	sizes: typeof AvailableSneakerSizes

	@Prop({
		type: [mongoose.Schema.Types.Mixed],
		required: true
	})
	color: Record<'label' | 'value', string>

	@Prop({ type: String, required: true, trim: true })
	style: AvailableSneakerStyles

	@Prop({
		type: String,
		required: true,
		trim: true,
		enum: ProductGender,
		default: ProductGender.UNISEX
	})
	gender: ProductGender
}

const SneakerProductSchema = SchemaFactory.createForClass(SneakerProduct)

export { SneakerProduct, SneakerProductSchema, type SneakerProductDocument }
