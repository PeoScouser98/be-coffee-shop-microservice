import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ProductCollectionDTO } from '../dto/product-collection.dto'
import { ProductCollectionRepository } from '../repositories/product-collection.repository'
import { I18nService } from '@app/i18n'

@Injectable()
export class ProductCollectionService {
	constructor(
		@Inject(ProductCollectionRepository.provide)
		private readonly productCollectionRepository: ProductCollectionRepository,
		private readonly i18nService: I18nService
	) {}

	async getProductCollections() {
		const productCollections = await this.productCollectionRepository.findAll()
		return new ServiceResult(productCollections, null)
	}

	async createProductCollection(payload) {
		const newProductCollection = await this.productCollectionRepository.createOne(payload)

		if (!Boolean(newProductCollection))
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.product_collection.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(newProductCollection, null)
	}

	async updateProductCollection(id: string, payload: Partial<ProductCollectionDTO>) {
		const updatedProductCollection = await (
			await this.productCollectionRepository.updateOneById(id, payload)
		).save()

		if (!Boolean(updatedProductCollection))
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.product_collection.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(updatedProductCollection, null)
	}

	async deleteProductCollection(id: string) {
		const deletedProductCollection = await this.productCollectionRepository.deleteOneById(id)
		if (!Boolean(deletedProductCollection))
			return new ServiceResult(deletedProductCollection, null)
		return new ServiceResult(deletedProductCollection)
	}
}
