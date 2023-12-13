import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, plugin } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'
import { BaseSchema } from '@/project/modules/base/schemas/base.schema'
import Collections from '@/project/common/constants/collections.constant'
import {
	ProductCollection,
	ProductCollectionDocument
} from '../../product-collections/schemas/product-collection.schema'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import _ from 'lodash'

declare type ProductDocument = HydratedDocument<IProduct>
@Schema({
	timestamps: true,
	versionKey: false,
	collection: Collections.PRODUCTS
})
class Product extends BaseSchema {
	@Prop({ type: String, required: true, trim: true })
	name: string

	@Prop({ type: mongoose.Schema.Types.Mixed, required: true, trim: true })
	description: Record<'vi' | 'en', string>

	@Prop({ type: String, enum: [] })
	productType: ProductTypeEnum

	@Prop({
		type: String,
		enum: Object.values(ProductStatus).filter((item) => typeof item !== 'number'),
		default: ProductStatus.COMMON,
		index: true
	})
	status: ProductStatus

	@Prop({ type: Number, required: true, min: 0 })
	price: number

	@Prop({ type: String, unique: true, default: 'AN' + Date.now().toString() })
	SKU: string

	@Prop({ type: String, slug: 'product_name', unique: true, index: true })
	slug: string

	@Prop({ type: Array, required: true, default: [] })
	galleryImages: Array<string>

	@Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
	attributes: Record<string, any>

	@Prop({ type: Boolean, default: false, select: false, index: true })
	isDraft: boolean // created product that has not published to store

	@Prop({ type: Boolean, default: false, select: false, index: true })
	isPublished: boolean // created product that published to store

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: ProductCollection.name,
		index: true
	})
	collection: mongoose.Types.ObjectId | ProductCollectionDocument

	@Prop({ type: Array, required: true, default: [] })
	variants: Array<mongoose.Types.ObjectId>
}

const ProductSchema = SchemaFactory.createForClass(Product)
ProductSchema.pre('save', function (next) {
	this.name = _.capitalize(this.name)
})
ProductSchema.plugin(require('mongoose-slug-generator'))
ProductSchema.plugin(require('mongoose-paginate-v2'))

export { type ProductDocument, Product, ProductSchema }
