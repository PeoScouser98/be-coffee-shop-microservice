import Collections from '@app/common/constants/collections.constant'
import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsNotEmpty, IsString } from 'class-validator'
import { HydratedDocument } from 'mongoose'
import { IProductCollection } from '../interfaces/product-collection.interface'

export type ProductCollectionDocument = HydratedDocument<IProductCollection>
@Schema({
	collection: Collections.PRODUCT_COLLECTIONS,
	...defaultSchemaOptions
})
export class ProductCollectionModelSchema extends BaseAbstractDocument {
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
		slug: 'name'
	})
	slug: string

	@Prop({ type: Date, default: new Date() })
	release_date: Date
}

export const ProductCollectionSchema = SchemaFactory.createForClass(ProductCollectionModelSchema)
