import { Controller } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { EventPattern } from '@nestjs/microservices'

@Controller()
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@EventPattern('new_discount')
	public async notifyNewDiscount() {}
}
