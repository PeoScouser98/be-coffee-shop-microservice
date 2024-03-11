import { IBaseRepository } from '@app/common'
import { IPurchaseOrder } from './purchase-order.interface'

export type IOrderRepository = IBaseRepository<IPurchaseOrder>
