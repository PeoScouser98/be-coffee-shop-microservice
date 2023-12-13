import Providers from '@/project/common/constants/provide.constant'
import { ServiceResponse } from '@/project/common/helpers/http.helper'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FilterQuery, PaginateOptions } from 'mongoose'
import { ProductDTO } from './dto/product.dto'
import { ProductRepository } from './product.repository'
import { ProductDocument } from './schemas/product.schema'

@Injectable()
export class ProductService {
	constructor(
		@Inject(Providers.PRODUCT_REPOSITORY)
		private readonly productRepository: ProductRepository
	) {}

	async getProducts(
		filter: FilterQuery<ProductDocument>,
		options: Pick<PaginateOptions, 'page' | 'limit'>
	) {
		const products = await this.productRepository.paginate(filter, {
			page: options.page,
			limit: options.limit
		})
		return new ServiceResponse(products)
	}
	async getProductBySlug(slug: string) {
		const product = await this.productRepository.findOneBySlug(slug)
		if (!product)
			return new ServiceResponse(null, {
				message: { vi: 'Không tìm thấy sản phẩm', en: 'Product could not be found' },
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResponse(product)
	}
	async publishedProduct(id: string) {
		const publisedProduct = await this.productRepository.updateOneById(id, {
			isPublished: true,
			isDraft: false
		})
		if (!publisedProduct)
			return new ServiceResponse(null, {
				message: {
					vi: 'Đẩy sản phẩm lên gian hàng thất bại',
					en: 'Failed to publish product to store'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})
		return new ServiceResponse(publisedProduct)
	}

	async updateProduct(id: string, payload: Partial<ProductDTO>) {
		const updatedProduct = await this.productRepository.updateOneById(
			id,
			payload as ProductDocument
		)
		if (!Boolean(updatedProduct))
			return new ServiceResponse(null, {
				message: {
					vi: 'Không cập nhật được sản phẩm',
					en: 'Failed to update product'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})
		return new ServiceResponse(updatedProduct)
	}

	async deleteProduct(id: string) {
		const deletedProduct = await this.productRepository.findOneAndDelete({
			_id: id,
			isDraft: true,
			isPublished: false
		})
		if (!deletedProduct)
			return new ServiceResponse(null, {
				message: {
					vi: 'Không tìm thấy sản phẩm để xóa',
					en: 'Product to delete could not be found'
				},
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResponse(deletedProduct)
	}
}
