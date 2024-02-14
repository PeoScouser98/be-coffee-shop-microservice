import { DiscountModelSchema, type DiscountDocument } from './schemas/discount.schema'
import { IDiscountRepository } from './interfaces/discount.repository.interface'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class DiscountRepository
	extends BaseAbstractRepository<DiscountDocument>
	implements IDiscountRepository
{
	constructor(
		@InjectModel(DiscountModelSchema.name) private readonly discountModel: Model<DiscountDocument>
	) {
		super(discountModel)
	}

	public async getProductByDisCountCode(discountCode: string) {
		return await this.discountModel
			.findOne({ discount_code: discountCode })
			.populate('products')
			.select('applied_for_products')
	}
}
