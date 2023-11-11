import { IBaseRepository } from 'src/modules/shared/repositories/base.interface.repository';
import { IProduct } from './product.interface';

export interface IProductRepository extends IBaseRepository<IProduct> {}
