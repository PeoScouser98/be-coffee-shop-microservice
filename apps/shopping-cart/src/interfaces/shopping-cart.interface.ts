import { IProduct } from 'apps/product/src/interfaces/product.interface'
import { ShoppingCartStatus } from '../constants/shopping-cart.constant'
import { IUser } from 'apps/auth/src/interfaces/user.interface'

export interface ICartItem extends Pick<IProduct, '_id' | 'name' | 'price'> {
	quantity: number
}

export interface IShoppingCart {
	status: ShoppingCartStatus
	items: Array<ICartItem>
	items_count: number
	created_by: Partial<IUser>
}
