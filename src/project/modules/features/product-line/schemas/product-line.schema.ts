import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { IProductLine } from '../interfaces/product-line.interface'
import Collections from '@/project/common/constants/collections.constant'
import _ from 'lodash'

@Schema({ collection: Collections.PRODUCT_LINES, timestamps: true, versionKey: false })
class ProductLine {
	@Prop({ type: String, required: true, trim: true })
	name: string

	@Prop({ type: String, slug: 'name', trim: true, lowercase: true })
	slug: string
}

declare type ProductLineDocument = HydratedDocument<IProductLine>

const ProductLineSchema = SchemaFactory.createForClass(ProductLine)
ProductLineSchema.pre('save', function (next) {
	this.name = _.capitalize(this.name)
	next()
})
ProductLineSchema.plugin(require('mongoose-slug-generator'))

export { type ProductLineDocument, ProductLineSchema, ProductLine }
