import { ServiceResult } from '@app/common'
import { HttpStatus } from '@nestjs/common'
import { IProduct } from './interfaces/product.interface'
import {
	AccessoryProductRepository,
	ProductRepository,
	SneakerProductRepository,
	TopHalfProductRepository
} from './product.repository'
import { ProductDTO } from './dto/product.dto'
import { ProductDocument } from './schemas/product.schema'
import { LocalizationService } from '@app/common'

export class ProductFactoryService {
	constructor(
		protected readonly localizationService: LocalizationService,
		protected readonly productRepository: ProductRepository
	) {}

	public async create(payload: ProductDTO): Promise<ServiceResult<ProductDocument>> {
		const newProduct = await this.productRepository.createOne(payload)
		if (!newProduct)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(newProduct)
	}

	public async update(id: string, payload) {
		if (!payload)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		const updatedProduct = this.productRepository.updateOneById(id, payload)
		if (!updatedProduct) {
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		}

		return new ServiceResult(updatedProduct)
	}
}

export class SneakerProductFactoryService extends ProductFactoryService {
	constructor(
		localizationService: LocalizationService,
		productRepository: ProductRepository,
		private readonly sneakerProductRepository: SneakerProductRepository
	) {
		super(localizationService, productRepository)
	}
	public override async create(payload: ProductDTO) {
		const { attributes, ...productInformation } = payload
		const { data, error } = await super.create(productInformation as ProductDTO)
		if (error) return { error }
		console.log(attributes)
		const newProduct = await this.sneakerProductRepository.createOne({
			_id: data._id,
			slug: data.slug,
			...attributes
		})
		if (!newProduct)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		return new ServiceResult({ createdProduct: data, createdChildProduct: newProduct })
	}

	public override async update(id: string, payload: Partial<IProduct> & Record<string, any>) {
		if (payload.attributes) {
			const updatedAccessoryProduct = await this.sneakerProductRepository.updateOneById(
				id,
				payload.attributes
			)
			if (!updatedAccessoryProduct)
				return new ServiceResult(null, {
					message: this.localizationService.t('error_messages.product.updating'),
					errorCode: HttpStatus.BAD_REQUEST
				})
		}

		return await super.update(id, payload)
	}
}

export class TopHalfProductFactoryService extends ProductFactoryService {
	constructor(
		localizationService: LocalizationService,
		productRepository: ProductRepository,
		private readonly topHalfProductRepository: TopHalfProductRepository
	) {
		super(localizationService, productRepository)
	}
	public override async create(payload: ProductDTO) {
		const { attributes, ...productInformation } = payload
		const { data, error } = await super.create(productInformation as ProductDTO)
		if (error) return { error }
		const newProduct = await this.topHalfProductRepository.createOne({
			_id: data._id,
			slug: data.slug,
			...attributes
		})
		if (!newProduct)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		return new ServiceResult({ createdProduct: data, createdChildProduct: newProduct })
	}

	public override async update(id: string, payload: Partial<IProduct> & Record<string, any>) {
		if (payload.attributes) {
			const updatedAccessoryProduct = await this.topHalfProductRepository.updateOneById(
				id,
				payload.attributes
			)
			if (!updatedAccessoryProduct)
				return new ServiceResult(null, {
					message: this.localizationService.t('error_messages.product.updating'),
					errorCode: HttpStatus.BAD_REQUEST
				})
		}
		return await super.update(id, payload)
	}
}
export class AccessoryProductFactoryService extends ProductFactoryService {
	constructor(
		localizationService: LocalizationService,
		productRepository: ProductRepository,
		private readonly accessoryProductRepository: AccessoryProductRepository
	) {
		super(localizationService, productRepository)
	}
	public override async create(payload: ProductDTO) {
		const { attributes, ...productInformation } = payload
		const { data, error } = await super.create(productInformation as ProductDTO)
		if (error) return { error }
		const newProduct = await this.accessoryProductRepository.createOne({
			_id: data._id,
			slug: data.slug,
			...attributes
		})
		if (!newProduct)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})
		return new ServiceResult({ createdProduct: data, createdChildProduct: newProduct })
	}

	public override async update(id: string, payload: Partial<IProduct> & Record<string, any>) {
		if (payload.attributes) {
			const updatedAccessoryProduct = await this.accessoryProductRepository.updateOneById(
				id,
				payload.attributes
			)

			if (!updatedAccessoryProduct)
				return new ServiceResult(null, {
					message: this.localizationService.t('error_messages.product.updating'),
					errorCode: HttpStatus.BAD_REQUEST
				})
		}

		return await super.update(id, payload)
	}
}
