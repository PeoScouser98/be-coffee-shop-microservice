import Providers from '@/project/common/constants/provide.constant'
import { Inject, Injectable } from '@nestjs/common'
import { ProductLineRepository } from './product-line.repository'
import { ProductLineDTO } from './dto/product-line.dto'
import { ServiceResponse } from '@/project/common/helpers/http.helper'
import { HttpStatus } from '@nestjs/common'

@Injectable()
export class ProductLineService {
	constructor(
		@Inject(Providers.PRODUCT_LINE_REPOSITORY)
		private readonly productLineRepository: ProductLineRepository
	) {}
	async getProductLines() {
		const productLines = await this.productLineRepository.findAll()
		return new ServiceResponse(productLines)
	}
	async createProductLine(payload: ProductLineDTO) {
		const newProductLine = await this.productLineRepository.createOne(payload)
		if (!newProductLine)
			return new ServiceResponse(null, {
				message: {
					vi: 'Tạo mới dòng sản phẩm không thành công',
					en: 'Failed to create new product line'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResponse(newProductLine)
	}

	async updateProductLine(id: string, payload: Partial<ProductLineDTO>) {
		const updatedProductLine = await this.productLineRepository.updateOneById(id, payload)
		if (!updatedProductLine)
			return new ServiceResponse(null, {
				message: {
					vi: 'Lỗi cập nhật dòng sản phẩm',
					en: 'Failed to update product line'
				},
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResponse(updatedProductLine)
	}

	async deleteProductLine(id: string) {
		const deletedProductLine = await this.productLineRepository.deleteOneById(id)
		if (!deletedProductLine)
			return new ServiceResponse(null, {
				message: { vi: '', en: '' },
				errorCode: HttpStatus.BAD_REQUEST
			})

		return new ServiceResponse(deletedProductLine)
	}
}
