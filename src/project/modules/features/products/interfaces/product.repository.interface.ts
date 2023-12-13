import { IBaseRepository } from '@/project/modules/base/repositories/base.interface.repository'
import { IProduct, ISneakerProduct } from './product.interface'

export interface IProductRepository extends IBaseRepository<IProduct> {}
export interface ISneakerProductRepository extends IBaseRepository<ISneakerProduct> {}
