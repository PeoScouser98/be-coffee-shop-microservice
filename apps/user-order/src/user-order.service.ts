import { Respositories } from '@app/common'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'

import { OrderRepository } from './user-order.repository'
import { ServiceResult } from '@app/common'
import { UserCartRepository } from 'apps/user-cart/src/user-cart.repository'
import { LocalizationService } from '@app/common'

@Injectable()
export class OrderService {
	constructor(
		@Inject(Respositories.ORDER) private readonly orderRepository: OrderRepository,
		@Inject(Respositories.USER_CART)
		private readonly userCartRepository: UserCartRepository,
		private readonly localizationService: LocalizationService
	) {}

	public async getOrderReview(user: string, orderId: string) {
		// Get user' cart
		const userCart = await this.userCartRepository.findOneById(orderId)
		if (!userCart)
			return new ServiceResult(null, {
				message: this.localizationService.t('error_messages.user_cart.not_found'),
				errorCode: HttpStatus.BAD_REQUEST
			})
	}
}
