import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IOrderRepository } from './interfaces/user-order.repository.interface'
import { UserOrderDocument, UserOrderModelSchema } from './schemas/user-order.schema'
import { Injectable } from '@nestjs/common'
import { BaseAbstractRepository } from '@app/common'
@Injectable()
export class OrderRepository
	extends BaseAbstractRepository<UserOrderDocument>
	implements IOrderRepository
{
	constructor(@InjectModel(UserOrderModelSchema.name) orderModel: Model<UserOrderDocument>) {
		super(orderModel)
	}
}
