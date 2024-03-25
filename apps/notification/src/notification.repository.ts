import { BaseAbstractRepository } from '@app/common'
import { Injectable } from '@nestjs/common'
import { NotificationDocument } from './schemas/notification.schema'
import { INotificationRepository } from './interfaces/notification.repository.interface'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'

@Injectable()
export class NotificationRepository
	extends BaseAbstractRepository<NotificationDocument>
	implements INotificationRepository
{
	static provide: string = 'NOTIFICATION_REPOSITORY'

	constructor(
		@InjectModel(Notification.name) notificationModel: Model<NotificationDocument>,
		@InjectConnection() connection: Connection
	) {
		super(notificationModel, connection)
	}
}
