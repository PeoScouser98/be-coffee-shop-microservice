import { DiscountModelSchema, type DiscountDocument } from './schemas/discount.schema'
import { IDiscountRepository } from './interfaces/discount.repository.interface'
import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class DiscountRepository
	extends BaseAbstractRepository<DiscountDocument>
	implements IDiscountRepository
{
	static provide: string = 'DISCOUNT_REPOSITORY'

	constructor(
		@InjectModel(DiscountModelSchema.name)
		private readonly discountModel: Model<DiscountDocument>,
		@InjectConnection() connection: Connection
	) {
		super(discountModel, connection)
	}

	public async getProductByDisCountCode(discountCode: string) {
		return await this.discountModel
			.findOne({ discount_code: discountCode })
			.populate('products')
			.select('applied_for_products')
	}
}
