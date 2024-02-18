import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IProductLine } from '../interfaces/product-line.interface'

export type ProductLineDocument = HydratedDocument<IProductLine>

const COLLECTION_NAME = 'product_lines' as const
@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions
})
export class ProductLine extends BaseAbstractSchema {
	@Prop({ type: String, required: true, trim: true })
	name: string

	@Prop({ type: String, slug: 'name', trim: true, lowercase: true })
	slug: string
}

export const ProductLineSchema = SchemaFactory.createForClass(ProductLine)
