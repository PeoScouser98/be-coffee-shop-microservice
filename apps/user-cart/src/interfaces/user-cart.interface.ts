import { IProduct } from 'apps/product/src/interfaces/product.interface'
import { UserCartStatus } from '../constants/user-cart.constant'
import { IUser } from 'apps/user/src/interfaces/user.interface'

export interface ICartItem extends Pick<IProduct, '_id' | 'name' | 'price'> {
	quantity: number
}

export interface IUserCart {
	status: UserCartStatus
	items: Array<ICartItem>
	items_count: number
	created_by: Partial<IUser>
}
