import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ServiceResult } from '@app/common'
import { PurchaseOrderRepository } from './purchase-order.repository'
import { I18nService } from '@app/i18n'
import { ShoppingCartRepository } from 'apps/shopping-cart/src/shopping-cart.repository'
import { PurchaseOrderStatus } from './constants/purchase-order.const'

@Injectable()
export class OrderService {
	constructor(
		@Inject(PurchaseOrderRepository.name)
		private readonly purchaseOrderRepository: PurchaseOrderRepository,
		@Inject(ShoppingCartRepository.name)
		private readonly shoppingCartRepository: ShoppingCartRepository,
		private readonly i18nService: I18nService
	) {}

	public async getOrderReview(user: string, orderId: string) {
		// Get user' cart
		const userCart = await this.shoppingCartRepository.findOneById(orderId)
		if (!userCart)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user_cart.not_found'),
				errorCode: HttpStatus.BAD_REQUEST
			})
	}

	public async getAllPurchasedOrders() {
		const purchaseOrders = await this.purchaseOrderRepository.find()
		return new ServiceResult(purchaseOrders)
	}

	public async updatePurchaseOrderStatus(purchaseOrderId: string, status: PurchaseOrderStatus) {
		const updatedPurchaseOrder = await this.purchaseOrderRepository.findByIdAndUpdate(
			purchaseOrderId,
			{ status }
		)
		if (!updatedPurchaseOrder)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.purchase_order.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult(updatedPurchaseOrder)
	}

	public async getOrderByCustomerEmail(customerEmail: string) {
		const customerPurchasedOrders = await this.purchaseOrderRepository.find({
			customer_email: customerEmail
		})

		return new ServiceResult(customerPurchasedOrders)
	}
}
