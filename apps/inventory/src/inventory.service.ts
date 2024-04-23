import { ServiceResult } from '@app/common'
import { I18nService } from '@app/i18n'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { FilterQuery } from 'mongoose'
import { InventoryDTO } from './dto/inventory.dto'
import { IInventory } from './interfaces/inventory.interface'
import { InventoryRepository } from './inventory.repository'
import { InventoryDocument } from './schema/inventory.schema'

@Injectable()
export class InventoryService {
	constructor(
		@Inject(InventoryRepository.provide)
		private readonly inventoryRepository: InventoryRepository,
		private readonly i18nService: I18nService
	) {}

	public async createProductInventory(
		payload: InventoryDTO
	): Promise<ServiceResult<InventoryDocument>> {
		const createdProductInventory = await this.inventoryRepository.create(payload)
		if (!createdProductInventory)
			throw new BadRequestException(this.i18nService.t('error_messages.inventory.creating'))
		return new ServiceResult(createdProductInventory)
	}

	public async getAllProductInventory(
		filterQuery: FilterQuery<InventoryDocument> = {}
	): Promise<InventoryDocument[]> {
		const productsInventory = await this.inventoryRepository.find(filterQuery, {
			populate: { path: 'product' }
		})
		if (!productsInventory)
			throw new NotFoundException(
				this.i18nService.t('error_messages.inventory.product_not_found')
			)
		return productsInventory
	}

	public async getProductInventory(productId: string): Promise<InventoryDocument> {
		const productInventory = await this.inventoryRepository.findOneByProductId(productId)
		if (!productInventory)
			throw new NotFoundException(
				this.i18nService.t('error_messages.inventory.product_not_found')
			)
		return productInventory
	}

	public async updateProductInventory(productId: string, payload: Partial<IInventory>) {}
}
