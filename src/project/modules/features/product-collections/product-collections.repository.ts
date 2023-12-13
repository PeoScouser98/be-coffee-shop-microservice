import { InjectModel } from '@nestjs/mongoose'
import { BaseAbstractRepository } from '../../base/repositories/base.abstract.repository'
import { IProductCollectionRepository } from './interfaces/product-collection-repository.interface'
import { ProductCollection, ProductCollectionDocument } from './schemas/product-collection.schema'
import { Model } from 'mongoose'

export class ProductCollectionRepository
	extends BaseAbstractRepository<ProductCollectionDocument>
	implements IProductCollectionRepository
{
	constructor(
		@InjectModel(ProductCollection.name)
		private readonly productCollectionModel: Model<ProductCollectionDocument>
	) {
		super(productCollectionModel)
	}
}
