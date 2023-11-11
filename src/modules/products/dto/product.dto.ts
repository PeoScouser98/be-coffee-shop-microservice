import { MinLength, IsString, IsNumber, Min } from 'class-validator';
import { IProduct } from '../interfaces/product.interface';

export class ProductDTO implements IProduct {
	id: string | number;

	@IsString()
	@MinLength(4)
	product_name: string;

	@IsNumber()
	@Min(0)
	price: number;

	@IsNumber()
	@Min(0)
	stock: number;

	attributes: { [key: string]: any };
}
