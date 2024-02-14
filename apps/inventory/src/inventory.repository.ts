import { Injectable } from '@nestjs/common'
import { InventoryModelSchema, InventoryDocument } from './schema/inventory.schema'
import { IInventoryRepository } from './interfaces/inventory.repository.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IInventory } from './interfaces/inventory.interface'
import { BaseAbstractRepository } from '@app/common'

@Injectable()
export class InventoryRepository
	extends BaseAbstractRepository<InventoryDocument>
	implements IInventoryRepository
{
	constructor(
		@InjectModel(InventoryModelSchema.name)
		private readonly inventoryModel: Model<InventoryDocument>
	) {
		super(inventoryModel)
	}

	public async findOneByProductId(productId: string): Promise<InventoryDocument> {
		return (await this.inventoryModel.findOne({ product: productId })).populate({
			path: 'product'
		})
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
