import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose'
import { BaseAbstractRepository } from '../../base/repositories/base.abstract.repository'
import {
	IProductRepository,
	ISneakerProductRepository
} from './interfaces/product.repository.interface'
import { Product, ProductDocument } from './schemas/product.schema'
import { SneakerProduct, SneakerProductDocument } from './schemas/sneaker-product.schema'

export class ProductRepository
	extends BaseAbstractRepository<ProductDocument>
	implements IProductRepository
{
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: PaginateModel<ProductDocument>
	) {
		super(productModel)
	}
	async paginate(filter: FilterQuery<ProductDocument>, options: PaginateOptions) {
		return await this.productModel.paginate(filter, options)
	}
	async findOneBySlug(slug: string) {
		return await this.productModel.findOne({ slug: slug })
	}

	async findOneAndDelete(filter: FilterQuery<ProductDocument>) {
		return await this.productModel.findOneAndDelete(filter)
	}
}

export class SneakerProductRepository
	extends BaseAbstractRepository<SneakerProductDocument>
	implements ISneakerProductRepository
{
	constructor(
		@InjectModel(SneakerProduct.name)
		private readonly sneakerProductModel: Model<SneakerProductDocument>
	) {
		super(sneakerProductModel)
	}
}
export class TopHalfProductRepository
	extends BaseAbstractRepository<SneakerProductDocument>
	implements ISneakerProductRepository
{
	constructor(
		@InjectModel(SneakerProduct.name)
		private readonly sneakerProductModel: Model<SneakerProductDocument>
	) {
		super(sneakerProductModel)
	}
}
