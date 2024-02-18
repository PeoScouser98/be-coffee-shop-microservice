import { BaseAbstractSchema, getDefaultSchemaOptions } from '@app/common'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { ProductMaterials } from '../constants/product.constant'
import { IAccessoryProduct } from '../interfaces/product.interface'

export type AccessoryProductDocument = HydratedDocument<IAccessoryProduct>

const COLLECTION_NAME = 'product_accessories' as const

@Schema({
	collection: COLLECTION_NAME,
	...getDefaultSchemaOptions()
})
export class AccessoryProduct extends BaseAbstractSchema {
	@Prop({
		type: String,
		enum: ['S', 'M', 'L']
	})
	sizes: string

	@Prop({ type: String, required: true, trim: true, enum: Object.values(ProductMaterials) })
	material: ProductMaterials
}

export const AccessoryProductSchema = SchemaFactory.createForClass(AccessoryProduct)
