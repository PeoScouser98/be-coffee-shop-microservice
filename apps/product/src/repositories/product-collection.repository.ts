import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { IProductCollectionRepository } from '../interfaces/product-collection-repository.interface'
import { ProductCollection, ProductCollectionDocument } from '../schemas/product-collection.schema'
import { Connection, Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

export class ProductCollectionRepository
	extends BaseAbstractRepository<ProductCollectionDocument>
	implements IProductCollectionRepository
{
	static provide: string = 'PRODUCT_COLLECTION_REPOSITORY' as const

	constructor(
		@InjectModel(ProductCollection.name)
		readonly productCollectionModel: Model<ProductCollectionDocument>,
		@InjectConnection() connection: Connection
	) {
		super(productCollectionModel, connection)
	}
}
