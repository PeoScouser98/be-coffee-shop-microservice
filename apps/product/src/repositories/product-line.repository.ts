import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { ProductLine, ProductLineDocument } from '../schemas/product-line.schema'

import { IProductLineRepository } from '../interfaces/product-line.repository.interface'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class ProductLineRepository
	extends BaseAbstractRepository<ProductLineDocument>
	implements IProductLineRepository
{
	constructor(
		@InjectModel(ProductLine.name)
		readonly productLineModel: Model<ProductLineDocument>,
		@InjectConnection()
		connection: Connection
	) {
		super(productLineModel, connection)
	}
}
