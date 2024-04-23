import { ServiceResult } from '@app/common'
import { I18nService } from '@app/i18n'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InventoryService } from 'apps/inventory/src/inventory.service'
import { ProductService } from 'apps/product/src/services/product.service'
import { pick } from 'lodash'
import mongoose from 'mongoose'
import { ICartItem } from './interfaces/shopping-cart.interface'
import { ShoppingCartRepository } from './shopping-cart.repository'

@Injectable()
export class ShoppingCartService {
	constructor(
		@Inject(ShoppingCartRepository.name)
		private readonly shoppingCartRepository: ShoppingCartRepository,
		private readonly productService: ProductService,
		private readonly inventoryService: InventoryService,
		private readonly i18nService: I18nService
	) {}

	public async getUserShoppingCart(credential: string) {
		return await this.shoppingCartRepository.findOne({
			$or: [{ session_id: credential }, { user: credential }]
		})
	}

	public async createShoppingCart(payload) {
		return await this.shoppingCartRepository.create(payload)
	}

	public async updateShoppingCart(
		credential: string,
		payload: Pick<ICartItem, 'product_id' | 'quantity'>
	) {
		const [product, productInventory] = await Promise.all([
			this.productService.getPublishedProductById(String(payload.product_id)),
			this.inventoryService.getProductInventory(String(payload.product_id))
		])

		// If cart item's quantity is greater than product inventory stock => throw error
		if (payload.quantity > productInventory.stock)
			throw new BadRequestException(
				this.i18nService.t('error_messages.shopping_cart.out_of_order')
			)

		const userCart = await this.shoppingCartRepository.findOne({
			$or: [{ user: credential }, { session_id: credential }]
		})
		// If user's cart is already existed and empty => add item to cart
		const itemToUpsert = {
			product_id: product._id,
			...pick(product, ['name', 'price', 'thumbnail']),
			quantity: payload.quantity
		} as ICartItem

		const existedItemInUserCart = userCart.items.find(
			(item) => String(item.product_id) === String(payload.product_id)
		)

		if (existedItemInUserCart) {
			const updatedUserCart = await this.shoppingCartRepository.updateCartItemQuantity(
				credential,
				new mongoose.Types.ObjectId(payload.product_id),
				payload.quantity
			)
			const updatedItem = updatedUserCart.items.find(
				(item) => String(item.product_id) === String(payload.product_id)
			)
			if (updatedItem.quantity === 0) {
				return await this.removeItemFromCart(credential, payload)
			}
			return updatedUserCart
		}

		return await this.shoppingCartRepository.addToCart(credential, itemToUpsert)
	}

	public async removeItemFromCart(
		credential: string,
		payload: Pick<ICartItem, 'product_id' | 'quantity'>
	) {
		const updatedUserCart = await this.shoppingCartRepository.deleteCartItem(
			credential,
			new mongoose.Types.ObjectId(payload.product_id)
		)
		return updatedUserCart
	}

	public async deleteUserCart(uid: string, productId: string) {
		const deletedCart = await this.shoppingCartRepository.deleteCartByUserId(uid)
		if (!deletedCart)
			throw new NotFoundException(this.i18nService.t('error_messages.shopping_cart.not_found'))
		return new ServiceResult(deletedCart)
	}
}
