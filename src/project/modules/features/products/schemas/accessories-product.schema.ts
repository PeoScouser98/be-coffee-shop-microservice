import Collections from '@/project/common/constants/collections.constant'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IAccessoriesProduct } from '../interfaces/product.interface'
import { Product } from './product.schema'

declare type AccessoriesProductDocument = HydratedDocument<IAccessoriesProduct>
@Schema({
	collection: Collections.PRODUCT_ACCESSORIES,
	timestamps: true,
	versionKey: false
})
class AccessoriesProduct extends Product {
	@Prop({
		type: String,
		enum: ['S', 'M', 'L']
	})
	sizes: string
}

const AccessoriesProductSchema = SchemaFactory.createForClass(AccessoriesProduct)

export { AccessoriesProduct, AccessoriesProductSchema, type AccessoriesProductDocument }
