import { ServiceResult } from '@app/common'
import {
	BadRequestException,
	ConflictException,
	HttpStatus,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import * as _ from 'lodash'
import mongoose, { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose'
import { ProductStatus, ProductTypeEnum } from '../constants/product.constant'
import { ProductDTO } from '../dto/product.dto'
import { IProduct } from '../interfaces/product.interface'
import { flatten } from 'flat'
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
} from '../repositories/product.repository'
import { ProductDocument } from '../schemas/product.schema'
import { I18nService } from '@app/i18n'

@Injectable()
export class ProductService {
	constructor(
		private readonly i18nService: I18nService,
		@Inject(SneakerProductRepository.name)
		private readonly sneakerProductRepository: SneakerProductRepository,
		@Inject(TopHalfProductRepository.name)
		private readonly topHalfProductRepository: TopHalfProductRepository,
		@Inject(AccessoryProductRepository.name)
		private readonly accessoryProductRepository: AccessoryProductRepository,
		@Inject(ProductRepository.name)
		protected readonly productRepository: ProductRepository
	) {}

	public async createProduct(payload: ProductDTO): Promise<ServiceResult<ProductDocument>> {
		const existedProductBySku = await this.productRepository.findOneBySku(payload.sku)

		if (existedProductBySku)
			throw new ConflictException(this.i18nService.t('error_messages.product.duplicated_sku'))

		switch (payload.product_type) {
			case ProductTypeEnum.SNEAKER:
				return await new SneakerProductFactoryService(
					this.i18nService,
					this.productRepository,
					this.sneakerProductRepository
				).create(payload)
			case ProductTypeEnum.TOP_HALF:
				return await new TopHalfProductFactoryService(
					this.i18nService,
					this.productRepository,
					this.topHalfProductRepository
				).create(payload)
			case ProductTypeEnum.ACCESSORY:
				return await new AccessoryProductFactoryService(
					this.i18nService,
					this.productRepository,
					this.accessoryProductRepository
				).create(payload)

			default:
				throw new BadRequestException(this.i18nService.t('error_messages.product.invalid_type'))
		}
	}

	public async updateProduct(
		id: string,
		type: ProductTypeEnum | string,
		payload: Partial<IProduct>
	): Promise<ServiceResult<ProductDocument>> {
		const update = flatten(payload)

		switch (type) {
			case ProductTypeEnum.SNEAKER:
				return await new SneakerProductFactoryService(
					this.i18nService,
					this.productRepository,
					this.sneakerProductRepository
				).update(id, update)
			case ProductTypeEnum.TOP_HALF:
				return await new TopHalfProductFactoryService(
					this.i18nService,
					this.productRepository,
					this.topHalfProductRepository
				).update(id, update)
			case ProductTypeEnum.ACCESSORY:
				return await new AccessoryProductFactoryService(
					this.i18nService,
					this.productRepository,
					this.accessoryProductRepository
				).update(id, update)

			default:
				throw new BadRequestException(this.i18nService.t('error_messages.product.invalid_type'))
		}
	}

	public async deleteProduct(id: string): Promise<ServiceResult<ProductDocument>> {
		const deletedProduct = await this.productRepository.findAndDeleteById(id)
		if (!deletedProduct)
			throw new NotFoundException(this.i18nService.t('error_messages.product.deleting'))

		switch (deletedProduct.type) {
			case ProductTypeEnum.SNEAKER:
				await this.sneakerProductRepository.findAndDeleteById(id)
				break
			case ProductTypeEnum.TOP_HALF:
				await this.topHalfProductRepository.findAndDeleteById(id)
				break
			case ProductTypeEnum.SNEAKER:
				await this.accessoryProductRepository.findAndDeleteById(id)
				break

			default:
				throw new NotFoundException(this.i18nService.t('error_messages.product.not_found'))
		}

		return deletedProduct
	}

	public async getAllPublisedProducts(
		filter: FilterQuery<ProductDocument>,
		options: PaginateOptions
	): Promise<PaginateResult<ProductDocument>> {
		return await this.productRepository.paginate(
			{ ...filter, is_published: true },
			{
				...options,
				populate: [
					{
						path: 'collection',
						strictPopulate: false
					},
					{
						path: 'product_line',
						strictPopulate: false
					}
				]
			}
		)
	}

	public async getPublisedProductBySlug({ slug, type }: { slug: string; type: ProductTypeEnum }) {
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

		const [product, attributes] = await Promise.all([
			this.productRepository.findOneBySlug(slug, { is_published: true }),
			repository.findOneBySlug(slug)
		])

		if (!product || !attributes)
			throw new NotFoundException(this.i18nService.t('error_messages.product.not_found'))

		return { ...product, attributes }
	}

	public async publishProduct(id: string): Promise<ProductDocument> {
		const publisedProduct = await this.productRepository.findByIdAndUpdate(id, {
			is_published: true,
			is_draft: false
		})
		if (!publisedProduct)
			throw new BadRequestException(this.i18nService.t('error_messages.product.publishing'))

		return publisedProduct
	}

	public async unpublishProduct(id: string): Promise<ProductDocument> {
		const unpublishedProduct = await this.productRepository.findByIdAndUpdate(id, {
			status: ProductStatus.SUSPENSED_BUSINESS
		})
		if (!unpublishedProduct)
			throw new BadRequestException(this.i18nService.t('error_messages.product.updating'))

		return unpublishedProduct
	}

	public async getAllDraftProducts(
		paginateOptions: PaginateOptions
	): Promise<PaginateResult<ProductDocument>> {
		const draftProducts = await this.productRepository.paginate(
			{ is_draft: true },
			{
				page: paginateOptions.page,
				limit: paginateOptions.limit
			}
		)

		return draftProducts
	}

	public async getPublishedProductById(id: string | mongoose.Types.ObjectId) {
		const product = await this.productRepository.findOne({
			_id: id,
			is_published: true
		})
		if (!product)
			throw new NotFoundException(this.i18nService.t('error_messages.product.not_found'))

		return product
	}
}
