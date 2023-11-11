import { Injectable } from '@nestjs/common';
import { ProductDTO } from './dto/product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BaseProduct } from './schemas/base-product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
	inititalData: Array<ProductDTO> = [
		{
			id: 1,
			product_name: 'Product 1',
			price: 1000,
			stock: 100,
			attributes: {}
		}
	];
	constructor(
		@InjectModel(BaseProduct.name) private productModel: Model<BaseProduct>
	) {}
	async getProducts() {
		return await this.productModel.find();
	}
	async createProduct(payload: ProductDTO) {
		this.inititalData.push(payload);
		return this.inititalData;
	}
	async updateProduct(id: string, payload: Partial<ProductDTO>) {
		// const index = this.inititalData.findIndex((item) => item.id == id);
		// this.inititalData[index] = { ...this.inititalData[index], ...payload };
		return this.inititalData;
	}
}
