import {
	ConflictException,
	HttpStatus,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { DiscountDTO } from './dto/discount.dto'
import { DiscountRepository } from './discount.repository'
import { ServiceResult } from '@app/common'
import { I18nService } from '@app/i18n'
import mongoose from 'mongoose'

@Injectable()
export class DiscountService {
	constructor(
		@Inject(DiscountRepository.provide) private readonly discountRepository: DiscountRepository,
		private readonly i18nService: I18nService
	) {}

	public async getAllDiscountCodes() {
		return await this.discountRepository.find()
	}

	public async createDiscountCode(payload: DiscountDTO) {
		const existedDiscountCode = await this.discountRepository.getProductByDiscountCode(
			payload.discount_code
		)
		if (existedDiscountCode) {
			throw new ConflictException(this.i18nService.t('error_messages.discount.existed'))
		}
		return await this.discountRepository.create(payload)
	}

	public async getAllProductByDiscountCode(discountCode: string) {
		return await this.discountRepository.findOne({
			discount_code: discountCode
		})
	}

	public async updateDiscountCode(id: mongoose.Types.ObjectId, payload: Partial<DiscountDTO>) {
		const updatedDiscountCode = await this.discountRepository.findByIdAndUpdate(id, payload)
		if (!updatedDiscountCode)
			throw new NotFoundException(this.i18nService.t('error_messages.discount.not_found'))
		return updatedDiscountCode
	}

	public async deleteDiscountCode(id: string) {
		const deletedDiscountCode = await this.discountRepository.findAndDeleteById(id)
		if (!deletedDiscountCode)
			throw new NotFoundException(this.i18nService.t('error_messages.discount.not_found'))
		return deletedDiscountCode
	}

	public async getDiscountAmount() {}

	public async cancelDiscountCode(discountCode) {}
}
