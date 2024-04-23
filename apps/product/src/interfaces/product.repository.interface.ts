import { IBaseRepository } from '@app/common'
import { IAccessoryProduct, ISneakerProduct, ITopHalfProduct } from './product.interface'
import { ProductDocument } from '../schemas/product.schema'

export interface IProductRepository extends IBaseRepository<ProductDocument> {}
export interface ISneakerProductRepository extends IBaseRepository<ISneakerProduct> {}
export interface ITopHalfProductRepository extends IBaseRepository<ITopHalfProduct> {}
export interface IAccessoryProductRepository extends IBaseRepository<IAccessoryProduct> {}
