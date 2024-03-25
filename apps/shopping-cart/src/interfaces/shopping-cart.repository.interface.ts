import { IBaseRepository } from '@app/common'
import { ShoppingCartDocument } from '../schemas/shopping-cart.schema'

export interface IShoppingCartRepository extends IBaseRepository<ShoppingCartDocument> {}
