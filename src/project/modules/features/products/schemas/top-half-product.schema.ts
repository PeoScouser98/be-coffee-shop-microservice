import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Product } from './product.schema'
import { HydratedDocument } from 'mongoose'
import Collections from '@/project/common/constants/collections.constant'
import { ITopHalfProduct } from '../interfaces/product.interface'
import { AvailableTopHalfSizes } from '../constants/product.constant'

declare type TopHalfProductDocument = HydratedDocument<ITopHalfProduct>

@Schema({
	collection: Collections.PRODUCT_TOP_HALF,
	timestamps: true,
	versionKey: false
})
class TopHalfProduct extends Product {
	@Prop({ type: Array, default: AvailableTopHalfSizes })
	sizes: typeof AvailableTopHalfSizes

	@Prop({ type: { label: String, value: String }, _id: false, required: true })
	color: Record<'label' | 'value', string>
}

const TopHalfProductSchema = SchemaFactory.createForClass(TopHalfProduct)

export { type TopHalfProductDocument, TopHalfProduct, TopHalfProductSchema }
