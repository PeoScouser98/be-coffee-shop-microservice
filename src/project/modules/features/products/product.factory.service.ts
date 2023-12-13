import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { ServiceResponse } from '@/project/common/helpers/http.helper'
import { ProductStatus, ProductTypeEnum } from './constants/product.constant'
import { ProductDTO } from './dto/product.dto'
import { IProduct } from './interfaces/product.interface'
import { ProductRepository, TopHalfProductRepository } from './product.repository'
import Providers from '@/project/common/constants/provide.constant'

@Injectable()
export class ProductFactoryService {
	constructor(
		@Inject(Providers.SNEAKER_PRODUCT_REPOSITORY)
		readonly sneakerProductRepository: TopHalfProductRepository,
		@Inject(Providers.PRODUCT_REPOSITORY)
		readonly productRepository: ProductRepository
	) {}

	async createProduct(payload: ProductDTO) {
		switch (payload.type) {
			case ProductTypeEnum.SNEAKER:
				return await new SneakerProductService(
					payload,
					this.productRepository,
					this.sneakerProductRepository
				).createProduct()

			default:
				return new ServiceResponse(null, {
					message: {
						vi: 'Loại sản phẩm không hợp lệ',
						en: 'Invalid product type'
					},
					errorCode: HttpStatus.BAD_REQUEST
				})
		}
	}

	async updateProduct(id: string, payload: Partial<ProductDTO>) {
		return {}
	}
}

class ProductService {
	name: string
	description: Record<'vi' | 'en', string>
	type: ProductTypeEnum
	status: ProductStatus
	price: number
	galleryImages: Array<string>
	attributes: Record<string, any>

	constructor(
		product: IProduct,
		private readonly productRepository: ProductRepository
	) {
		this.name = product.name
		this.description = product.description
		this.type = product.type
		this.status = product.status
		this.price = product.price
		this.galleryImages = product.galleryImages
		this.attributes = product.attributes
	}

	async createProduct(productId: Types.ObjectId) {
		return this.productRepository.createOne({
			_id: productId,
			name: this.name,
			type: this.type,
			status: this.status,
			description: this.description,
			galleryImages: this.galleryImages,
			price: this.price,
			attributes: this.attributes
		})
	}
}

class SneakerProductService extends ProductService {
	constructor(
		product: IProduct,
		productRepository: ProductRepository,
		private sneakerProductRepository: TopHalfProductRepository
	) {
		super(product, productRepository)
	}
	override async createProduct(): Promise<any> {
		const newSneakerProduct = await this.sneakerProductRepository.createOne(this.attributes)
		if (!newSneakerProduct)
			return new ServiceResponse(null, {
				message: {
					vi: 'Lỗi tạo sản phẩm sneaker',
					en: 'Failed to create sneaker product'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})

		const newProduct = await super.createProduct(newSneakerProduct._id)
		if (!newProduct)
			return new ServiceResponse(null, {
				message: { vi: 'Lỗi tạo sản phẩm', en: 'Failed to create product' },
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResponse(newProduct, null)
	}
}
