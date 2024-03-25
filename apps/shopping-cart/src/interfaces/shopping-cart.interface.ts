import { IProduct } from 'apps/product/src/interfaces/product.interface'
import { ShoppingCartStatus } from '../constants/shopping-cart.constant'
import { IUser } from 'apps/auth/src/interfaces/user.interface'
import mongoose from 'mongoose'

export interface ICartItem extends Pick<IProduct, 'name' | 'price' | 'thumbnail'> {
	product_id: string | mongoose.Types.ObjectId
	quantity: number
}

export interface IShoppingCart {
	status: ShoppingCartStatus
	items: Array<ICartItem>
	items_count: number
	user: mongoose.Types.ObjectId | Partial<IUser> | null
	session_id: string | null
}
