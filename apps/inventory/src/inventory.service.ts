import { Repositories } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InventoryDTO } from './dto/inventory.dto'
import { IInventory } from './interfaces/inventory.interface'
import { InventoryRepository } from './inventory.repository'
import { ServiceResult } from '@app/common'
import { FilterQuery } from 'mongoose'
import { InventoryDocument } from './schema/inventory.schema'
import { LocalizationService } from '@app/common'

@Injectable()
export class InventoryService {
	constructor(
		@Inject(Repositories.INVENTORY) private readonly inventoryRepository: InventoryRepository,
		private readonly localizationService: LocalizationService
	) {}

	public async createProductInventory(
		payload: InventoryDTO
	): Promise<ServiceResult<InventoryDocument>> {
		const createdProductInventory = await this.inventoryRepository.createOne(payload)
		if (!createdProductInventory)
			return new ServiceResult<null>(null, {
				message: this.localizationService.t('error_messages.inventory.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		return new ServiceResult(createdProductInventory)
	}
	public async getAllProductInventory(
		filterQuery: FilterQuery<InventoryDocument> = {}
	): Promise<ServiceResult<InventoryDocument[]>> {
		const productsInventory = await this.inventoryRepository.findWithFilter(filterQuery, {
			populate: { path: 'product' }
		})
		if (!productsInventory)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.inventory.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(productsInventory)
	}
	public async getProductInventory(productId: string): Promise<ServiceResult<InventoryDocument>> {
		const productInventory = await this.inventoryRepository.findOneByProductId(productId)
		if (!productInventory)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.inventory.product_not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(productInventory)
	}

	public async updateProductInventory(productId: string, payload: Partial<IInventory>) {}
}
