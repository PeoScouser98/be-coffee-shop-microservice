import { Injectable, Inject, HttpStatus } from '@nestjs/common'
import { ProductCollectionRepository } from './product-collections.repository'
import { ServiceResponse } from '@/project/common/helpers/http.helper'
import { ProductCollectionDTO } from './dto/product-collections.dto'
import Providers from '@/project/common/constants/provide.constant'

@Injectable()
export class ProductCollectionService {
	constructor(
		@Inject(Providers.PRODUCT_COLLECTION_REPOSITORY)
		private readonly productCollectionRepository: ProductCollectionRepository
	) {}

	async getProductCollections() {
		const productCollections = await this.productCollectionRepository.findAll()
		return new ServiceResponse(productCollections, null)
	}

	async createProductCollection(payload) {
		const newProductCollection = await this.productCollectionRepository.createOne(payload)

		if (!Boolean(newProductCollection))
			return new ServiceResponse(null, {
				message: {
					vi: 'Lỗi không thêm được bộ sưu tập sản phẩm',
					en: 'Failed to create product collection'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResponse(newProductCollection, null)
	}

	async updateProductCollection(id: string, payload: Partial<ProductCollectionDTO>) {
		const updatedProductCollection = await this.productCollectionRepository.updateOneById(
			id,
			payload
		)
		if (!Boolean(updatedProductCollection))
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tìm thấy bộ sưu tập sản phẩm',
					en: 'Product collection could not be found'
				},
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResponse(updatedProductCollection, null)
	}

	async deleteProductCollection(id: string) {
		const deletedProductCollection = await this.productCollectionRepository.deleteOneById(id)
		if (!Boolean(deletedProductCollection))
			return new ServiceResponse(deletedProductCollection, null)
	}
}
