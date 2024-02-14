import { InjectModel } from '@nestjs/mongoose'
import { IProductCollectionRepository } from './interfaces/product-collection-repository.interface'
import {
	ProductCollectionModelSchema,
	ProductCollectionDocument
} from './schemas/product-collection.schema'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

export class ProductCollectionRepository
	extends BaseAbstractRepository<ProductCollectionDocument>
	implements IProductCollectionRepository
{
	constructor(
		@InjectModel(ProductCollectionModelSchema.name)
		private readonly productCollectionModel: Model<ProductCollectionDocument>
	) {
		super(productCollectionModel)
	}
}
