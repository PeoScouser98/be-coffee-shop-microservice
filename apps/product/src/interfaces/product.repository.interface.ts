import { IBaseRepository } from '@app/common'
import { IAccessoryProduct, IProduct, ISneakerProduct, ITopHalfProduct } from './product.interface'

export interface IProductRepository extends IBaseRepository<IProduct> {}
export interface ISneakerProductRepository extends IBaseRepository<ISneakerProduct> {}
export interface ITopHalfProductRepository extends IBaseRepository<ITopHalfProduct> {}
export interface IAccessoryProductRepository extends IBaseRepository<IAccessoryProduct> {}
