import { ServiceResult } from '@app/common'
import { I18nService } from '@app/i18n'
import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ShoppingCartRepository } from './shopping-cart.repository'
import { ProductService } from 'apps/product/src/services/product.service'
import { InventoryService } from 'apps/inventory/src/inventory.service'
import {pick} from 'lodash'

@Injectable()
export class ShoppingCartService {
	constructor(
		@Inject(ShoppingCartRepository.provide)
		private readonly shoppingCartRepository: ShoppingCartRepository,
		private readonly productService: ProductService,
		private readonly inventoryService: InventoryService,
		private readonly i18nService: I18nService
	) {}

	public async createShoppingCart(user: string, productId: string, quantity = 1) {
		const { data, error } = await this.productService.getPublishedProductById(productId)
		if (error) return new ServiceResult(null, error)
		const userCart = await this.shoppingCartRepository.upsertCartItemByUser(user, {
			...pick(data, ['_id', 'name', 'price']),
			quantity
		})
		return new ServiceResult(userCart)
	}

	public async updateShoppingCart(user: string, productId: string, quantity: number) {
		const [
			{ data: product, error: findProductError },
			{ data: productInventory, error: findProductInventoryError }
		] = await Promise.all([
			this.productService.getPublishedProductById(productId),
			this.inventoryService.getProductInventory(productId)
		])
		if (findProductError) return new ServiceResult(null, findProductError)
		if (findProductInventoryError) return new ServiceResult(null, findProductInventoryError)
		// If cart item's quantity is greater than product inventory stock => throw error
		if (quantity > productInventory.stock)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.user_cart.out_of_order'),
				errorCode: HttpStatus.BAD_REQUEST
			})

		const userCart = await this.shoppingCartRepository.findOneById(user)
		// If user's cart does not exist => create new one
		if (!userCart) {
			const newUserCart = await this.createShoppingCart(user, productId, quantity)
			return new ServiceResult(newUserCart)
		}
		// If user's cart is already existed and empty => add item to cart
		if (userCart.items_count === 0) {
			userCart.items = [{ ...pick(product, ['_id', 'name', 'price']), quantity: quantity }]
			userCart.items_count = quantity
			const updatedUserCart = await userCart.save()
			return new ServiceResult(updatedUserCart)
		}
		// If user's cart and item alreadky existed => update item quantity
		const existedItemInUserCart = userCart.items.find((item) => String(item._id) === productId)
		if (existedItemInUserCart) {
			// If current item's quantity equals to 0 => delete this item from user's cart
			if (quantity === 0) {
				const updatedUserCart = await this.shoppingCartRepository.deleteCartItem(
					user,
					productId
				)
				return new ServiceResult(updatedUserCart)
			}
			const updatedUserCart = await this.shoppingCartRepository.updateCartItemQuantity(
				user,
				productId,
				quantity
			)
			return new ServiceResult(updatedUserCart)
		}
	}

	public async deleteUserCart(uid: string, productId: string) {
		const deletedCart = await this.shoppingCartRepository.deleteCartByUserId(uid)
		if (!deletedCart)
			return new ServiceResult(null, {
				message: this.i18nService.t('error_messages.shopping_cart.not_found'),
				errorCode: HttpStatus.NOT_FOUND
			})

		return new ServiceResult(deletedCart)
	}
}
