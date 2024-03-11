import { ServiceResult } from '@app/common'
import { Inject, Injectable } from '@nestjs/common'
import { NotificationDocument } from './schemas/notification.schema'
import { NotificationRepository } from './notification.repository'

@Injectable()
export class NotificationService {
	constructor(
		@Inject(NotificationRepository.provide)
		private readonly notificationRepository: NotificationRepository
	) {}

	public async createNotification(payload): Promise<ServiceResult<NotificationDocument>> {
		const newNotification = await this.notificationRepository.createOne(payload)
		return new ServiceResult(newNotification)
	}
}
