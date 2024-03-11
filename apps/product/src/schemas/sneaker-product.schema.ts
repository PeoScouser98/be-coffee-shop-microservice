import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import {
	AvailableSneakerSizes,
	AvailableSneakerStyles,
	ProductGender,
	ProductMaterials
} from '../constants/product.constant'
import { ISneakerProduct } from '../interfaces/product.interface'

export type SneakerProductDocument = HydratedDocument<ISneakerProduct>

const COLLECTION_NAME = 'product_sneakers' as const

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class SneakerProduct extends BaseAbstractSchema {
	@Prop({
		type: [String],
		required: true,
		default: AvailableSneakerSizes
	})
	sizes: typeof AvailableSneakerSizes

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	color_name: string

	@Prop({
		type: String,
		required: true,
		trim: true
	})
	color_hex: string

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

	@Prop({ type: Array, required: true, trim: true })
	material: [ProductMaterials]

	@Prop({ type: Array, default: [] })
	variants: Array<mongoose.Types.ObjectId>
}

export const SneakerProductSchema = SchemaFactory.createForClass(SneakerProduct)
