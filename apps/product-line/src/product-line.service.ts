import { Respositories } from '@app/common'
import { ServiceResult } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'

import { ProductLineDTO } from './dto/product-line.dto'
import { ProductLineRepository } from './product-line.repository'
import { LocalizationService } from '@app/common'

@Injectable()
export class ProductLineService {
	constructor(
		@Inject(Respositories.PRODUCT_LINE)
		private readonly productLineRepository: ProductLineRepository,
		private readonly localizationService: LocalizationService
	) {}
	async getProductLines() {
		const productLines = await this.productLineRepository.findAll()
		return new ServiceResult(productLines)
	}
	async createProductLine(payload: ProductLineDTO) {
		const newProductLine = await this.productLineRepository.createOne(payload)
		if (!newProductLine)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product_line.creating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(newProductLine)
	}

	async updateProductLine(id: string, payload: Partial<ProductLineDTO>) {
		const updatedProductLine = await this.productLineRepository.updateOneById(id, payload)
		if (!updatedProductLine)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product_line.updating'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(updatedProductLine)
	}

	async deleteProductLine(id: string) {
		const deletedProductLine = await this.productLineRepository.deleteOneById(id)
		if (!deletedProductLine)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.product_line.deleting'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResult(deletedProductLine)
	}
}
