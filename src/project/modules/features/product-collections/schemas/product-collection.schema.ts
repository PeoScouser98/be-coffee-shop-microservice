import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IProductCollection } from '../interfaces/product-collection.interface'
import Collections from '@/project/common/constants/collections.constant'
import { IsNotEmpty, IsString } from 'class-validator'
import _ from 'lodash'

declare type ProductCollectionDocument = HydratedDocument<IProductCollection>
@Schema({
	timestamps: true,
	versionKey: false,
	collection: Collections.PRODUCT_COLLECTIONS
})
class ProductCollection {
	@Prop({
		type: String,
		required: true,
		trim: true,
		index: true,
		validators: [IsString, IsNotEmpty]
	})
	name: string

	@Prop({
		type: String,
		trim: true,
		index: true,
		lowercase: true,
		slug: 'name',
		validators: [IsString]
	})
	slug: string

	@Prop({ type: Date, default: new Date() })
	release_date: Date
}

const ProductCollectionSchema = SchemaFactory.createForClass(ProductCollection)
ProductCollectionSchema.pre('save', function (next) {
	this.name = _.capitalize(this.name)
})
ProductCollectionSchema.plugin(require('mongoose-slug-generator'))

export { type ProductCollectionDocument, ProductCollection, ProductCollectionSchema }
