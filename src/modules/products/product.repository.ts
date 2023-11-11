import { InjectModel } from '@nestjs/mongoose';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import { IProductRepository } from './interfaces/product.repository.interface';
import { BaseProduct, ProductDocument } from './schemas/base-product.schema';
import { DrinkingProduct } from './schemas/drink-product.schema';

export class BaseProductRepository
	extends BaseAbstractRepository<ProductDocument>
	implements IProductRepository
{
	constructor(@InjectModel(BaseProduct.name) private readonly baseProdModel) {
		super(baseProdModel);
	}
}

export class DrinkingProductRepository
	extends BaseAbstractRepository<ProductDocument>
	implements IProductRepository
{
	constructor(
		@InjectModel(DrinkingProduct.name) private readonly drinkProdModel
	) {
		super(drinkProdModel);
	}
}
