import { Repositories } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { DiscountDTO } from './dto/discount.dto'
import { DiscountRepository } from './discount.repository'
import { ServiceResult } from '@app/common'
import { LocalizationService } from '@app/common'

@Injectable()
export class DiscountService {
	constructor(
		@Inject(Repositories.DISCOUNT) private readonly discountRepository: DiscountRepository,
		private readonly localizationService: LocalizationService
	) {}

	public async createDiscountCode(payload: DiscountDTO) {
		const newDiscountCode = await this.discountRepository.createOne(payload)
		return new ServiceResult(newDiscountCode)
	}

	public async getAllDiscountCodes() {
		const discountCodes = await this.discountRepository.findAll()
		return new ServiceResult(discountCodes)
	}

	public async getAllProductByDiscountCode(discountCode: string) {
		const products = await this.discountRepository.findOneWithFilter({
			discount_code: discountCode
		})
	}

	public async getDiscountAmount() {}

	public async deleteDiscountCode(id: string) {
		const deletedDiscountCode = await this.discountRepository.deleteOneById(id)
		if (!deletedDiscountCode)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.discount.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})
		return new ServiceResult(deletedDiscountCode)
	}

	public async cancelDiscountCode() {}
}
