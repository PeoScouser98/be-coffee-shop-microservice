import { ServiceResult } from '@app/common'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ProductLineDTO } from '../dto/product-line.dto'
import { ProductLineRepository } from '../repositories/product-line.repository'
import { I18nService } from '@app/i18n'

@Injectable()
export class ProductLineService {
	constructor(
		@Inject(ProductLineRepository.name)
		private readonly productLineRepository: ProductLineRepository,
		private readonly i18nService: I18nService
	) {}
	async getProductLines() {
		const productLines = await this.productLineRepository.all()
		return new ServiceResult(productLines)
	}
	async createProductLine(payload: ProductLineDTO) {
		const newProductLine = await this.productLineRepository.create(payload)
		if (!newProductLine)
			throw new BadRequestException(this.i18nService.t('error_messages.product_line.creating'))
		return newProductLine
	}

	async updateProductLine(id: string, payload: Partial<ProductLineDTO>) {
		const updatedProductLine = await this.productLineRepository.findByIdAndUpdate(id, payload)

		if (!updatedProductLine)
			throw new BadRequestException(this.i18nService.t('error_messages.product_line.updating'))

		return updatedProductLine
	}

	async deleteProductLine(id: string) {
		const deletedProductLine = await this.productLineRepository.findAndDeleteById(id)
		if (!deletedProductLine)
			throw new BadRequestException(this.i18nService.t('error_messages.product_line.deleting'))

		return deletedProductLine
	}
}
