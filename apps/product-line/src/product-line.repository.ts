import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProductLineModelSchema, ProductLineDocument } from './schemas/product-line.schema'

import { IProductLineRepository } from './interfaces/product-line.repository.interface'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class ProductLineRepository
	extends BaseAbstractRepository<ProductLineDocument>
	implements IProductLineRepository
{
	constructor(
		@InjectModel(ProductLineModelSchema.name)
		private readonly productLineModel: Model<ProductLineDocument>
	) {
		super(productLineModel)
	}
}
