import { IBaseRepository } from '@app/common'
import { NotificationDocument } from '../schemas/notification.schema'

export interface INotificationRepository extends IBaseRepository<NotificationDocument> {}
