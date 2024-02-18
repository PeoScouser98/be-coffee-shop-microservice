import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'
import {
	IAccessoryProductRepository,
	IProductRepository,
	ISneakerProductRepository
} from '../interfaces/product.repository.interface'
import { AccessoryProduct, AccessoryProductDocument } from '../schemas/accessory-product.schema'
import { ProductDocument, Product } from '../schemas/product.schema'
import { SneakerProductDocument, SneakerProduct } from '../schemas/sneaker-product.schema'
import { TopHalfProduct } from '../schemas/top-half-product.schema'

export class ProductRepository
	extends BaseAbstractRepository<ProductDocument>
	implements IProductRepository
{
	static provide: string = 'PRODUCT_REPOSITORY' as const
	constructor(
		@InjectModel(Product.name)
		private readonly productModel: PaginateModel<ProductDocument>,
		@InjectConnection() connection: Connection
	) {
		super(productModel, connection)
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
}

export class SneakerProductRepository
	extends BaseAbstractRepository<SneakerProductDocument>
	implements ISneakerProductRepository
{
	static provide = 'PRODUCT_SNEAKER_REPOSITORY' as const

	constructor(
		@InjectModel(SneakerProduct.name)
		private readonly sneakerProductModel: Model<SneakerProductDocument>,
		@InjectConnection() connection: Connection
	) {
		super(sneakerProductModel, connection)
	}
	async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.sneakerProductModel.findOne({ slug: slug, ...filter })
	}
}
export class TopHalfProductRepository
	extends BaseAbstractRepository<SneakerProductDocument>
	implements ISneakerProductRepository
{
	static provide: string = 'TOP_HALF_PRODUCT_REPOSITORIES' as const
	constructor(
		@InjectModel(TopHalfProduct.name)
		private readonly sneakerProductModel: Model<SneakerProductDocument>,
		@InjectConnection() connection: Connection
	) {
		super(sneakerProductModel, connection)
	}
	public async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.sneakerProductModel.findOne({ slug: slug, ...filter })
	}
}
export class AccessoryProductRepository
	extends BaseAbstractRepository<AccessoryProductDocument>
	implements IAccessoryProductRepository
{
	static provide: string = 'PRODUCT_ACCESSORY_REPOSITORY' as const

	constructor(
		@InjectModel(AccessoryProduct.name)
		private readonly accessoryProductModel: Model<AccessoryProductDocument>,
		@InjectConnection() connection: Connection
	) {
		super(accessoryProductModel, connection)
	}

	public async findOneBySlug(slug: string, filter?: FilterQuery<ProductDocument>) {
		return await this.accessoryProductModel.findOne({ slug: slug, ...filter })
	}
}
