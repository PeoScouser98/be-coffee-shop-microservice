import Collections from '@app/common/constants/collections.constant'
import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import {
	AvailableTopHalfSizes,
	ProductGender,
	ProductMaterials
} from '../constants/product.constant'
import { ITopHalfProduct } from '../interfaces/product.interface'

export type TopHalfProductDocument = HydratedDocument<ITopHalfProduct>

@Schema({
	collection: Collections.PRODUCT_TOP_HALF,
	...defaultSchemaOptions
})
export class TopHalfProductModelSchema extends BaseAbstractDocument {
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

export const TopHalfProductSchema = SchemaFactory.createForClass(TopHalfProductModelSchema)
