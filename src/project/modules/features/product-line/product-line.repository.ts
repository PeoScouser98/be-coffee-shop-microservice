import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProductLine, ProductLineDocument } from './schemas/product-line.schema'
import { BaseAbstractRepository } from '../../base/repositories/base.abstract.repository'
import { IProductLineRepository } from './interfaces/product-line.repository.interface'

@Injectable()
export class ProductLineRepository
	extends BaseAbstractRepository<ProductLineDocument>
	implements IProductLineRepository
{
	constructor(
		@InjectModel(ProductLine.name)
		private readonly productLineModel: Model<ProductLineDocument>
	) {
		super(productLineModel)
	}
}
