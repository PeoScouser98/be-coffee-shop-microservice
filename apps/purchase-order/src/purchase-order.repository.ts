import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { IOrderRepository } from './interfaces/purchase-order.repository.interface'
import { PurchaseOrderDocument, PurchaseOrder } from './schemas/purchase-order.schema'
import { Injectable } from '@nestjs/common'
import { BaseAbstractRepository } from '@app/common'
@Injectable()
export class PurchaseOrderRepository
	extends BaseAbstractRepository<PurchaseOrderDocument>
	implements IOrderRepository
{
	static provide: string = 'PURCHASE_ORDER_REPOSITORY'

	constructor(
		@InjectModel(PurchaseOrder.name) orderModel: Model<PurchaseOrderDocument>,
		@InjectConnection() connection: Connection
	) {
		super(orderModel, connection)
	}
}
