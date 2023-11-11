import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseProduct } from './base-product.schema';

@Schema()
export class DrinkingProduct extends BaseProduct {
	@Prop({
		type: String,
		enum: ['S', 'M', 'L']
	})
	size: string;
}

export const DrinkProdSchema = SchemaFactory.createForClass(DrinkingProduct);
