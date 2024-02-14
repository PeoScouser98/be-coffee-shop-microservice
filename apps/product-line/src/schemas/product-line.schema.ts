import Collections from '@app/common/constants/collections.constant'
import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IProductLine } from '../interfaces/product-line.interface'

export type ProductLineDocument = HydratedDocument<IProductLine>
@Schema({
	collection: Collections.PRODUCT_LINES,
	...defaultSchemaOptions
})
export class ProductLineModelSchema extends BaseAbstractDocument {
	@Prop({ type: String, required: true, trim: true })
	name: string

	@Prop({ type: String, slug: 'name', trim: true, lowercase: true })
	slug: string
}

export const ProductLineSchema = SchemaFactory.createForClass(ProductLineModelSchema)
