import { IBaseRepository } from '@app/common'
import { IAccessoryProduct, IProduct, ISneakerProduct, ITopHalfProduct } from './product.interface'

export type IProductRepository = IBaseRepository<IProduct>
export type ISneakerProductRepository = IBaseRepository<ISneakerProduct>
export type ITopHalfProductRepository = IBaseRepository<ITopHalfProduct>
export type IAccessoryProductRepository = IBaseRepository<IAccessoryProduct>
