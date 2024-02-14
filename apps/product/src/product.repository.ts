import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'
import {
	IAccessoryProductRepository,
	IProductRepository,
	ISneakerProductRepository
} from './interfaces/product.repository.interface'
import { AccessoryProduct, AccessoryProductDocument } from './schemas/accessory-product.schema'
import { ProductDocument, ProductModelSchema } from './schemas/product.schema'
import { SneakerProductDocument, SneakerProductModelSchema } from './schemas/sneaker-product.schema'
import { TopHalfProductModelSchema } from './schemas/top-half-product.schema'

export class ProductRepository
	extends BaseAbstractRepository<ProductDocument>
	implements IProductRepository
{
	constructor(
		@InjectModel(ProductModelSchema.name)
		private readonly productModel: PaginateModel<ProductDocument>
	) {
		super(productModel)
	}
	public async paginate(filter: FilterQuery<ProductDocument>, options: PaginateOptions) {
		return await this.productModel.paginate(filter, options)
	}
	public async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.productModel.findOne({ slug: slug, ...filter })
	}
	public async findOneBySku(sku: string, filter?: FilterQuery<ProductDocument>) {
		return await this.productModel.findOne({ sku: sku, ...filter })
	}

	public async findOneAndDelete(filter: FilterQuery<ProductDocument>) {
		return await this.productModel.findOneAndDelete(filter)
	}

	public
}

export class SneakerProductRepository
	extends BaseAbstractRepository<SneakerProductDocument>
	implements ISneakerProductRepository
{
	constructor(
		@InjectModel(SneakerProductModelSchema.name)
		private readonly sneakerProductModel: Model<SneakerProductDocument>
	) {
		super(sneakerProductModel)
	}
	async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.sneakerProductModel.findOne({ slug: slug, ...filter })
	}
}
export class TopHalfProductRepository
	extends BaseAbstractRepository<SneakerProductDocument>
	implements ISneakerProductRepository
{
	constructor(
		@InjectModel(TopHalfProductModelSchema.name)
		private readonly sneakerProductModel: Model<SneakerProductDocument>
	) {
		super(sneakerProductModel)
	}
	public async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.sneakerProductModel.findOne({ slug: slug, ...filter })
	}
}
export class AccessoryProductRepository
	extends BaseAbstractRepository<AccessoryProductDocument>
	implements IAccessoryProductRepository
{
	constructor(
		@InjectModel(AccessoryProduct.name)
		private readonly accessoryProductModel: Model<AccessoryProductDocument>
	) {
		super(accessoryProductModel)
	}

	public async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.accessoryProductModel.findOne({ slug: slug, ...filter })
	}
}
