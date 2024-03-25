import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import {
	AvailableTopHalfSizes,
	ProductGender,
	ProductMaterials
} from '../constants/product.constant'
import { ITopHalfProduct } from '../interfaces/product.interface'

export type TopHalfProductDocument = HydratedDocument<ITopHalfProduct>

const COLLECTION_NAME = 'product_top_half' as const
@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class TopHalfProduct extends BaseAbstractSchema {
	@Prop({ type: Array, default: AvailableTopHalfSizes })
	sizes: typeof AvailableTopHalfSizes

	@Prop({
		type: String,
		required: true,
		trim: true,
		enum: ProductGender,
		default: ProductGender.UNISEX
	})
	gender: ProductGender

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

	@Prop({ type: String, required: true, trim: true, enum: Object.values(ProductMaterials) })
	material: ProductMaterials
}

export const TopHalfProductSchema = SchemaFactory.createForClass(TopHalfProduct)
