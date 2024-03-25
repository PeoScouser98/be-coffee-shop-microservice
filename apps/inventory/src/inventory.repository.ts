import { Injectable } from '@nestjs/common'
import { Inventory, InventoryDocument } from './schema/inventory.schema'
import { IInventoryRepository } from './interfaces/inventory.repository.interface'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { IInventory } from './interfaces/inventory.interface'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class InventoryRepository
	extends BaseAbstractRepository<InventoryDocument>
	implements IInventoryRepository
{
	public static provide: string = 'INVENTORY_REPOSITORY' as const

	constructor(
		@InjectModel(Inventory.name)
		private readonly inventoryModel: Model<InventoryDocument>,
		@InjectConnection() connection: Connection
	) {
		super(inventoryModel, connection)
	}

	public async findOneByProductId(productId: string): Promise<any> {
		return await this.inventoryModel.find({ product: productId }).populate([
			{ path: 'product', strictPopulate: false, select: 'name price sku thumbnail' },
			{ path: 'store', strictPopulate: false, select: 'name address' }
		])
	}

	public async updateOneByProductId(
		productId: string,
		payload: Partial<IInventory>
	): Promise<InventoryDocument> {
		return await this.inventoryModel.findOneAndUpdate({ product: productId }, payload, {
			new: true
		})
	}
}
