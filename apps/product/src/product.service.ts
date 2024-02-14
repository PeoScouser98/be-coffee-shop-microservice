import Collections from '@app/common/constants/collections.constant'
import Respositories from '@app/common/constants/repositories.constant'
import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import * as _ from 'lodash'
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'
import { ProductStatus, ProductTypeEnum } from './constants/product.constant'
import { ProductDTO } from './dto/product.dto'
import { IProduct } from './interfaces/product.interface'
import {
	AccessoryProductFactoryService,
	SneakerProductFactoryService,
	TopHalfProductFactoryService
} from './product.factory.service'
import {
	AccessoryProductRepository,
	ProductRepository,
	SneakerProductRepository,
	TopHalfProductRepository
} from './product.repository'
import { ProductDocument } from './schemas/product.schema'
import { LocalizationService } from '@app/common'
import { flatten } from 'flat'

@Injectable()
export class ProductService {
	constructor(
		private readonly localizationService: LocalizationService,
		@Inject(Respositories.SNEAKER_PRODUCT)
		private readonly sneakerProductRepository: SneakerProductRepository,
		@Inject(Respositories.TOP_HALF_PRODUCT)
		private readonly topHalfProductRepository: TopHalfProductRepository,
		@Inject(Respositories.ACCESSORY_PRODUCT)
		private readonly accessoryProductRepository: AccessoryProductRepository,
		@Inject(Respositories.PRODUCT)
		protected readonly productRepository: ProductRepository
	) {}

	public async createProduct(payload: ProductDTO): Promise<ServiceResult<ProductDocument>> {
		const existedProductBySku = await this.productRepository.findOneBySku(payload.sku)

		if (existedProductBySku)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_mesages.product.duplicated_sku'),
				errorCode: HttpStatus.CONFLICT
			})

		switch (payload.product_type) {
			case ProductTypeEnum.SNEAKER:
				return await new SneakerProductFactoryService(
					this.localizationService,
					this.productRepository,
					this.sneakerProductRepository
				).create(payload)
			case ProductTypeEnum.TOP_HALF:
				return await new TopHalfProductFactoryService(
					this.localizationService,
					this.productRepository,
					this.topHalfProductRepository
				).create(payload)
			case ProductTypeEnum.ACCESSORY:
				return await new AccessoryProductFactoryService(
					this.localizationService,
					this.productRepository,
					this.accessoryProductRepository
				).create(payload)

			default:
				return new ServiceResult(null, {
					message: this.localizationService.t('messages.product.invalid_type'),
					errorCode: HttpStatus.BAD_REQUEST
				})
		}
	}

	public async updateProduct(
		id: string,
		type: ProductTypeEnum,
		payload: Partial<IProduct>
	): Promise<ServiceResult<ProductDocument>> {
		const update = flatten(payload)

		switch (type) {
			case ProductTypeEnum.SNEAKER:
				return await new SneakerProductFactoryService(
					this.localizationService,
					this.productRepository,
					this.sneakerProductRepository
				).update(id, update)
			case ProductTypeEnum.TOP_HALF:
				return await new TopHalfProductFactoryService(
					this.localizationService,
					this.productRepository,
					this.topHalfProductRepository
				).update(id, update)
			case ProductTypeEnum.ACCESSORY:
				return await new AccessoryProductFactoryService(
					this.localizationService,
					this.productRepository,
					this.accessoryProductRepository
				).update(id, update)

			default:
				return new ServiceResult(null, {
					message: this.localizationService.t('messages.product.invalid_type'),
					errorCode: HttpStatus.BAD_REQUEST
				})
		}
	}

	public async deleteProduct(id: string): Promise<ServiceResult<ProductDocument>> {
		const deletedProduct = await this.productRepository.deleteOneById(id)
		if (!deletedProduct) {
			return new ServiceResult(null, {
				message: this.localizationService.t('errors_messages.product.deleting'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		switch (deletedProduct.type) {
			case ProductTypeEnum.SNEAKER:
				await this.sneakerProductRepository.deleteOneById(id)
				break
			case ProductTypeEnum.TOP_HALF:
				await this.topHalfProductRepository.deleteOneById(id)
				break
			case ProductTypeEnum.SNEAKER:
				await this.accessoryProductRepository.deleteOneById(id)
				break

			default:
				return new ServiceResult(null, {
					message: this.localizationService.t('errors_messages.product.not_found'),
					errorCode: HttpStatus.NOT_FOUND
				})
		}

		return new ServiceResult(deletedProduct)
	}

	public async getAllPublisedProducts(
		filter: FilterQuery<ProductDocument>,
		options: PaginateOptions
	): Promise<ServiceResult<PaginateResult<ProductDocument>>> {
		const products = await this.productRepository.paginate(
			{ ...filter, is_published: true },
			{
				...options,
				populate: [
					{
						path: Collections.PRODUCT_COLLECTIONS
					},
					{
						path: Collections.PRODUCT_LINES
					}
				]
			}
		)
		return new ServiceResult(products)
	}

	public async getPublisedProductBySlug({ slug, type }: { slug: string; type: string }) {
		const repository = (() => {
			switch (type) {
				case ProductTypeEnum.SNEAKER:
					return this.sneakerProductRepository
				case ProductTypeEnum.TOP_HALF:
					return this.topHalfProductRepository
				case ProductTypeEnum.ACCESSORY:
					return this.accessoryProductRepository
			}
		})()

		if (!_.has(ProductTypeEnum, [type]))
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.invalid_type'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		const [product, attributes] = await Promise.all([
			this.productRepository.findOneBySlug(slug, { is_published: true }),
			repository.findOneBySlug(slug)
		])

		if (!product || attributes)
			return new ServiceResult(null, {
				message: this.localizationService.t('mesages.product.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult({ ...product, attributes })
	}

	public async publishProduct(id: string): Promise<ServiceResult<ProductDocument>> {
		const publisedProduct = await this.productRepository.updateOneById(id, {
			is_published: true,
			is_draft: false
		})
		if (!publisedProduct)
			return new ServiceResult(null, {
				message: this.localizationService.t('messages.product.publishing_failure'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(publisedProduct)
	}

	public async unpublishProduct(id: string): Promise<ServiceResult<ProductDocument>> {
		const unpublishedProduct = await this.productRepository.updateOneById(id, {
			status: ProductStatus.SUSPENSED_BUSINESS
		})
		if (!unpublishedProduct) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}
		return new ServiceResult(unpublishedProduct)
	}

	public async getAllDraftProducts(
		paginateOptions: PaginateOptions
	): Promise<ServiceResult<PaginateResult<ProductDocument>>> {
		const draftProducts = await this.productRepository.paginate(
			{ is_draft: true },
			{
				page: paginateOptions.page,
				limit: paginateOptions.limit,
				populate: [
					{
						path: Collections.PRODUCT_COLLECTIONS,
						localField: 'collection',
						foreignField: '_id'
					},
					{
						path: Collections.PRODUCT_LINES,
						localField: 'product_line',
						foreignField: '_id'
					}
				]
			}
		)

		return new ServiceResult(draftProducts)
	}

	public async getPublishedProductById(id: string) {
		const product = await this.productRepository.findOneWithFilter({
			_id: id,
			is_published: true
		})
		if (!product)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(product)
	}
}
