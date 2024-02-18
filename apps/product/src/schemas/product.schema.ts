import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'
import { IProduct } from '../interfaces/product.interface'
import { ProductCollectionDocument } from 'apps/product/src/schemas/product-collection.schema'
import { ProductLineDocument } from 'apps/product/src/schemas/product-line.schema'
import { Locale } from '@app/i18n'

export type ProductDocument = HydratedDocument<IProduct>

const COLLECTION_NAME = 'products' as const

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions
})
export class Product extends BaseAbstractSchema {
	@Prop({ type: String, required: true, trim: true })
	name: string

	@Prop({ type: mongoose.Schema.Types.Mixed, required: true, trim: true })
	description: Record<Locale, string>

	@Prop({ type: String, enum: Object.values(ProductTypeEnum) })
	product_type: ProductTypeEnum

	@Prop({
		type: String,
		enum: Object.values(ProductStatus).filter((item) => typeof item !== 'number'),
		default: ProductStatus.COMMON,
		index: true
	})
	status: ProductStatus

	@Prop({ type: Number, required: true, min: 0 })
	price: number

	@Prop({ type: String, unique: true, default: Date.now().toString() })
	sku: string

	@Prop({ type: String, slug: 'product_name', unique: true, index: true })
	slug: string

	@Prop({ type: String, required: true, trim: true })
	thumbnail: Array<string>

	@Prop({ type: Array, required: true, default: [] })
	gallery_images: Array<string>

	@Prop({ type: Boolean, default: false, select: false, index: true })
	is_draft: boolean // created product that has not published to store

	@Prop({ type: Boolean, default: false, select: false, index: true })
	is_published: boolean // created product that published to store

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductCollection',
		index: true
	})
	collection: mongoose.Types.ObjectId | ProductCollectionDocument

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ProductLine',
		index: true
	})
	product_line: mongoose.Types.ObjectId | ProductLineDocument
}

export const ProductSchema = SchemaFactory.createForClass(Product)
