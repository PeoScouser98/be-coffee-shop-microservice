import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';
import { BaseSchema } from '../../../modules/shared/schemas/base.schema';

export type ProductDocument = HydratedDocument<IProduct>;

const COLLECTION_NAME = 'products';

@Schema({ timestamps: true, versionKey: false, collection: COLLECTION_NAME })
export class BaseProduct extends BaseSchema {
	@Prop({ type: String, required: true, trim: true })
	product_name: string;

	@Prop({ type: Number, required: true, min: 0 })
	price: number;

	@Prop({ type: Number, required: true, min: 0, max: 100 })
	discount: number;

	@Prop(raw({ default: {} }))
	attributes: Record<string, any>;
}

@Schema()
export class Desert extends BaseProduct {}

export const BaseProductSchema = SchemaFactory.createForClass(BaseProduct);

export const DesertProdSchema = SchemaFactory.createForClass(Desert);
