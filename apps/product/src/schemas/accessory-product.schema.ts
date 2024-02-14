import { BaseAbstractDocument, defaultSchemaOptions } from '@app/common'
import { Collections } from '@app/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { ProductMaterials } from '../constants/product.constant'
import { IAccessoryProduct } from '../interfaces/product.interface'

type AccessoryProductDocument = HydratedDocument<IAccessoryProduct>
@Schema({
	collection: Collections.PRODUCT_ACCESSORIES,
	...defaultSchemaOptions
})
class AccessoryProductModelSchema extends BaseAbstractDocument {
	@Prop({
		type: String,
		enum: ['S', 'M', 'L']
	})
	sizes: string

	@Prop({ type: String, required: true, trim: true, enum: Object.values(ProductMaterials) })
	material: ProductMaterials
}

const AccessoryProductSchema = SchemaFactory.createForClass(AccessoryProductModelSchema)

export {
	AccessoryProductModelSchema as AccessoryProduct,
	AccessoryProductSchema,
	type AccessoryProductDocument
}
